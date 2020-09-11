
import json
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from matplotlib import cm, colors

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
sample_n_edges = 1000
dist_feature = 'weighted_dist'
node_size = 20
scale_multiplier = 20
weight_multiplier = 10
tweet_count_clip_value = 10
followers_clip_value = 50000

# ###################### DATA PREPROCESSING ######################
# Load data
df_edges = pd.read_csv(edges_path).sample(sample_n_edges)
df_nodes = pd.read_csv(nodes_path)\
    .set_index('node_id')

nodes_ids = set(
    df_edges.source.drop_duplicates().astype(str).tolist()
    +
    df_edges.target.drop_duplicates().astype(str).tolist()
)

df_nodes = df_nodes[df_nodes.index.isin(nodes_ids)]

df_nodes['tweet_count_scaled'] = MinMaxScaler().fit_transform(
    df_nodes['Tweet Count']
    .clip(upper=tweet_count_clip_value)
    .values
    .reshape(-1, 1)
) * node_size * 2

df_nodes['followers_scaled'] = MinMaxScaler().fit_transform(
    df_nodes['Followers']
    .clip(upper=followers_clip_value)
    .values
    .reshape(-1, 1)
) * node_size * 2

df_nodes['followers_c'] = [
    colors.rgb2hex(c)
    for c in cm.Blues(
        colors.TwoSlopeNorm(
            vmin=df_nodes['Followers'].min(),
            vcenter=df_nodes['Followers'].mean(),
            vmax=df_nodes['Followers'].max()
        )(df_nodes['Followers'])
    )
]
df_nodes['tweet_count_c'] = [
    colors.rgb2hex(c)
    for c in cm.Blues(
        colors.TwoSlopeNorm(
            vmin=df_nodes['Tweet Count'].min(),
            vcenter=df_nodes['Tweet Count'].mean(),
            vmax=df_nodes['Tweet Count'].max()
        )(df_nodes['Tweet Count'])
    )
]
df_nodes['sentiment_c'] = [
    colors.rgb2hex(c)
    for c in cm.coolwarm(
        colors.TwoSlopeNorm(
            vmin=-1,
            vcenter=0,
            vmax=1
        )(df_nodes['Mean Sentiment'])
    )
]
df_nodes['constant_c'] = 'gray'

no_data_nodes = pd.Series(list(nodes_ids))
no_data_nodes = no_data_nodes[~no_data_nodes.isin(df_nodes.index)].to_list()


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
        'width': edge[dist_feature]*weight_multiplier
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
            "position": {
                "x": node.tsne_0*scale_multiplier,
                "y": node.tsne_1*scale_multiplier
            }
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
            "height": node_size,
            "width": node_size,
        }
    },
    {
        "selector": 'edge',
        'style': {
            "curve-style": "bezier",
            "opacity": 0.2,
            "width": "data(width)"
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
                'animate': False
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
                drc.NamedDropdown(
                    name='Node color feature',
                    id='input-color-feature',
                    value='constant_c',
                    clearable=False,
                    options=drc.DropdownOptionsList(
                        'constant_c',
                        'sentiment_c',
                        'tweet_count_c',
                        'followers_c'
                    )
                ),
                # Add the remaining configs here
                html.H3('More stuff is going to go here'),
                drc.NamedDropdown(
                    name='Node Size',
                    id='dropdown-node-size',
                    value='constant',
                    clearable=False,
                    options=drc.DropdownOptionsList(
                        'constant',
                        'tweet_count_scaled',
                        'followers_scaled'
                    )
                )
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

# Uncomment and delete functions below if you want data on hover
# @app.callback(Output('tap-node-json-output', 'children'),
#               [Input('cytoscape', 'mouseoverNodeData')])
# def display_tap_node(data):
#     if data is not None:
#         return json.dumps(data['data'], indent=2)
#     else:
#         return None
#
#
# @app.callback(Output('tap-edge-json-output', 'children'),
#               [Input('cytoscape', 'mouseoverEdgeData')])
# def display_tap_edge(data):
#     return json.dumps(data, indent=2)


@app.callback(Output('tap-node-json-output', 'children'),
              [Input('cytoscape', 'tapNode')])
def display_tap_node(data):
    if data is not None:
        return json.dumps(data['data'], indent=2)
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


@app.callback(
    Output('cytoscape', 'stylesheet'),
    [
        Input('cytoscape', 'tapNode'),
        Input('input-follower-color', 'value'),
        Input('input-following-color', 'value'),
        Input('dropdown-node-shape', 'value'),
        Input('dropdown-node-size', 'value'),
        Input('input-color-feature', 'value')
    ]
)
def generate_stylesheet(
    node,
    follower_color,
    following_color,
    node_shape,
    node_size,
    color_feature
):
    if not node:
        index = {}
        for i in range(len(default_stylesheet)):
            index[default_stylesheet[i]['selector']] = i
        default_stylesheet[
            index['node']
        ]['style']['height'] = (
            f"data({node_size})"
            if node_size != 'constant'
            else scale_multiplier
        )
        default_stylesheet[
            index['node']
        ]['style']['width'] = (
            f"data({node_size})"
            if node_size != 'constant'
            else scale_multiplier
        )
        default_stylesheet[
            index['node']
        ]['style']['background-color'] = f'data({color_feature})'

        return default_stylesheet

    stylesheet = [{
        "selector": 'node',
        'style': {
            'opacity': 0.35,
            'shape': node_shape,
            'background-color': f'data({color_feature})',
            'height': (
                f"data({node_size})"
                if node_size != 'constant'
                else scale_multiplier
            ),
            'width': (
                f"data({node_size})"
                if node_size != 'constant'
                else scale_multiplier
            ),
        }
    }, {
        'selector': 'edge',
        'style': {
            'opacity': 0.1,
            "curve-style": "bezier",
            "width": "data(width)"
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
