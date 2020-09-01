
import json
import pandas as pd

import dash
from dash.dependencies import Input, Output, State
import dash_core_components as dcc
import dash_html_components as html

import dash_cytoscape as cyto
import src.visualization._dash_reusable_components as drc

from rich.progress import track

# import the css template, and pass the css template into dash
external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']
app = dash.Dash(__name__, external_stylesheets=external_stylesheets)
server = app.server

# Hyper params
edges_path = 'data/results/edges_users.csv'
nodes_path = 'data/results/nodes_users.csv'
dist_feature = 'weighted_dist'

# ###################### DATA PREPROCESSING ######################
# Load data
df_edges = pd.read_csv(edges_path).head(100)
df_nodes = pd.read_csv(nodes_path)\
    .set_index('node_id')

nodes_ids = set(
    df_edges.source.drop_duplicates().astype(str).tolist()
    +
    df_edges.target.drop_duplicates().astype(str).tolist()
)

df_nodes = df_nodes[df_nodes.index.isin(nodes_ids)]
no_data_nodes = pd.Series(list(nodes_ids))
no_data_nodes = no_data_nodes[~no_data_nodes.isin(df_nodes.index)].to_list()


def get_node_data(id_, df):
    try:
        node = df.loc[id_]\
            .rename({'name': 'label'})\
            .to_dict()
        node['id'] = id_
    except KeyError:
        node = {
            k: None for k in df.rename({'name': 'label'}).columns
        }
        node['id'] = id_

    return node


cy_edges = []
cy_nodes = []

for id_, edge in track(
    df_edges.iterrows(),
    description='Preparing edges',
    total=df_edges.shape[0]
):

    source = int(edge.source)
    target = int(edge.target)

    edge_dict = {'data': {
        'id': id_,
        'source': str(source),
        'target': str(target),
        'width': edge[dist_feature]
    }}
    cy_edges.append(edge_dict)


for id_, node in track(
    df_nodes.iterrows(),
    description='Preparing nodes',
    total=df_nodes.shape[0]
):

    cy_nodes.append(
        {
            "data": {**{'id': node.name}, **node.to_dict()},
            "position": {"x": node.tsne_0*50, "y": node.tsne_1*50}
        }
    )

# deal with nodes with no data
for _id in track(
        no_data_nodes,
        description='Adding missing nodes'
):
    cy_nodes.append(
        {
            "data": {'id': _id},
            "position": {"x": 0, "y": 0}
        }
    )

default_stylesheet = [
    {
        "selector": 'node',
        'style': {
            "opacity": 0.65,
        }
    },
    {
        "selector": 'edge',
        'style': {
            "curve-style": "bezier",
            "opacity": 0.2
        }
    },
]


# ################################# APP LAYOUT ################################

styles = {
    'json-output': {
        'overflow-y': 'scroll',
        'height': 'calc(50% - 25px)',
        'border': 'thin lightgrey solid'
    },
    'tab': {
        'height': 'calc(98vh - 105px)'
    }
}

app.layout = html.Div([
    html.Div(className='eight columns', children=[
        cyto.Cytoscape(
            id='cytoscape',
            elements=cy_edges + cy_nodes,
            layout={
                'name': 'preset',
                'animate': True
            },
            style={
                'height': '95vh',
                'width': '100%'
            }
        )
    ]),

    html.Div(className='four columns', children=[
        dcc.Tabs(id='tabs', children=[
            dcc.Tab(label='Control Panel', children=[
                html.H3('General Configs'),
                html.Div([
                    html.Div(className='six columns', children=[
                        drc.NamedDropdown(
                            name='Layout',
                            id='dropdown-layout',
                            options=drc.DropdownOptionsList(
                                'preset',
                                'random',
                                'grid',
                                'circle',
                                'concentric',
                                'breadthfirst',
                                'cose'
                            ),
                            value='preset',
                            clearable=False
                        )
                    ]),

                    html.Div(className='six columns', children=[
                        drc.NamedDropdown(
                            name='Node Shape',
                            id='dropdown-node-shape',
                            value='ellipse',
                            clearable=False,
                            options=drc.DropdownOptionsList(
                                'ellipse',
                                'triangle',
                                'rectangle',
                                'diamond',
                                'pentagon',
                                'hexagon',
                                'heptagon',
                                'octagon',
                                'star',
                                'polygon',
                            )
                        )
                    ])
                ]),
                html.H3('Colors'),
                html.Div([
                    html.Div(className='six columns', children=[
                        drc.NamedInput(
                            name='Retweeted From',
                            id='input-follower-color',
                            type='text',
                            value='blue',
                        ),
                    ]),
                    html.Div(className='six columns', children=[
                        drc.NamedInput(
                            name='Retweeted by',
                            id='input-following-color',
                            type='text',
                            value='red',
                        )
                    ]),
                ]),

                # Add the remaining configs here
                html.H3('More stuff is going to go here'),

            ]),

            dcc.Tab(label='Data', children=[
                html.Div(style=styles['tab'], children=[
                    html.P('Node Object JSON:'),
                    html.Pre(
                        id='tap-node-json-output',
                        style=styles['json-output']
                    ),
                    html.P('Edge Object JSON:'),
                    html.Pre(
                        id='tap-edge-json-output',
                        style=styles['json-output']
                    )
                ])
            ])
        ]),
    ])
])

# ############################## CALLBACKS ####################################


@app.callback(Output('tap-node-json-output', 'children'),
              [Input('cytoscape', 'tapNode')])
def display_tap_node(data):
    if data is not None:
        # Uncomment this later
        # return json.dumps(data['data'], indent=2)
        return json.dumps(data, indent=2)
    else:
        return None


@app.callback(Output('tap-edge-json-output', 'children'),
              [Input('cytoscape', 'tapEdge')])
def display_tap_edge(data):
    return json.dumps(data, indent=2)


@app.callback(Output('cytoscape', 'layout'),
              [Input('dropdown-layout', 'value')])
def update_cytoscape_layout(layout):
    return {'name': layout}


@app.callback(Output('cytoscape', 'stylesheet'),
              [Input('cytoscape', 'tapNode'),
               Input('input-follower-color', 'value'),
               Input('input-following-color', 'value'),
               Input('dropdown-node-shape', 'value')])
def generate_stylesheet(node, follower_color, following_color, node_shape):
    if not node:
        return default_stylesheet

    stylesheet = [{
        "selector": 'node',
        'style': {
            'opacity': 0.3,
            'shape': node_shape
        }
    }, {
        'selector': 'edge',
        'style': {
            'opacity': 0.05,
            "curve-style": "bezier",
        }
    }, {
        "selector": 'node[id = "{}"]'.format(node['data']['id']),
        "style": {
            'background-color': 'gray',
            "border-color": 'black',
            "border-width": 2,
            "border-opacity": 1,
            "opacity": 1,

            "label": "data(name)",
            "color": "gray",
            "text-opacity": 1,
            "font-size": 12,
            'z-index': 9999
        }
    }]

    for edge in node['edgesData']:
        if edge['source'] == node['data']['id']:
            stylesheet.append({
                "selector": 'node[id = "{}"]'.format(edge['target']),
                "style": {
                    'background-color': following_color,
                    'opacity': 0.9
                }
            })
            stylesheet.append({
                "selector": 'edge[id= "{}"]'.format(edge['id']),
                "style": {
                    "mid-target-arrow-color": following_color,
                    "mid-target-arrow-shape": "vee",
                    "line-color": following_color,
                    'opacity': 0.9,
                    'z-index': 5000
                }
            })

        if edge['target'] == node['data']['id']:
            stylesheet.append({
                "selector": 'node[id = "{}"]'.format(edge['source']),
                "style": {
                    'background-color': follower_color,
                    'opacity': 0.9,
                    'z-index': 9999
                }
            })
            stylesheet.append({
                "selector": 'edge[id= "{}"]'.format(edge['id']),
                "style": {
                    "mid-target-arrow-color": follower_color,
                    "mid-target-arrow-shape": "vee",
                    "line-color": follower_color,
                    'opacity': 1,
                    'z-index': 5000
                }
            })

    return stylesheet


if __name__ == '__main__':
    app.run_server(debug=True)
