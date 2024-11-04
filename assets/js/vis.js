    // Set dimensions for the simulation
    const width = 928;
    const height = 680;

    // Define color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Example data (replace with actual data if available)
    const data = {
        nodes: d3.range(20).map(i => ({ id: `Node ${i}`, group: i % 3 })),
        links: d3.range(30).map(() => ({
            source: `Node ${Math.floor(Math.random() * 20)}`,
            target: `Node ${Math.floor(Math.random() * 20)}`,
            value: Math.random() * 2
        }))
    };

    // Clone nodes and links to avoid data mutation
    const links = data.links.map(d => ({ ...d }));
    const nodes = data.nodes.map(d => ({ ...d }));

    // Select the SVG
    const svg = d3.select("#force-background")
                  .attr("viewBox", [-width / 2, -height / 2, width, height])
                  .attr("style", "max-width: 100%; height: auto;");

    // Create link and node elements
    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("r", 5)
        .attr("fill", d => color(d.group));

    // Tooltip for node titles
    node.append("title")
        .text(d => d.id);

    // Add drag behavior to nodes
    node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Set up the simulation
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .on("tick", ticked);

    // Update link and node positions on each tick
    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    // Drag behavior functions
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }
