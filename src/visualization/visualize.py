from src.visualization import (
    viz_preprocess_data,
    make_dashboard_app
)


cy_nodes, cy_edges = viz_preprocess_data(
    edges_path='data/results/edges_users.csv',
    nodes_path='data/results/nodes_users.csv',
    dist_feature='weighted_dist',
    sample_n_edges=2000,
    node_size=20,
    scale_multiplier=20,
    weight_multiplier=10,
    tweet_count_clip_value=10,
    followers_clip_value=500000
)
app = make_dashboard_app(
    cy_nodes,
    cy_edges,
    node_size=20,
    scale_multiplier=20
)
app.run_server(debug=True)
