import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const NonLinearTimePerception = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  
  useEffect(() => {
    // Clear previous SVG if it exists
    d3.select("#visualization").selectAll("*").remove();
    
    // Define key moments and quotes from the narrative
    const moments = [
      { id: 1, name: "Past", quote: "Memory is a strange thing. It does not work like I thought it did." },
      { id: 2, name: "Meeting Aliens", quote: "There are days that define your story beyond your life like the day they arrived." },
      { id: 3, name: "Meeting You", quote: "What surprised me most, it wasn't meeting them, it was meeting you." },
      { id: 4, name: "Stars", quote: "I've had my head tilted up to the stars for as long as I can remember." },
      { id: 5, name: "Emotional Expression", quote: "Maybe I'd say what I feel more often." },
      { id: 6, name: "Whole Life", quote: "If you could see your whole life from start to finish, would you change things?" },
      { id: 7, name: "Time's Order", quote: "We are so bound by time, by its order." },
      { id: 8, name: "No Beginnings", quote: "I used to think this was the beginning of your story, but now I'm not so sure I believe in beginnings and endings." }
    ];
    
    // Define connections between moments that are thematically linked
    const connections = [
      { source: 0, target: 2 },
      { source: 0, target: 6 },
      { source: 1, target: 2 },
      { source: 1, target: 5 },
      { source: 2, target: 4 },
      { source: 3, target: 7 },
      { source: 4, target: 5 },
      { source: 5, target: 7 },
      { source: 6, target: 7 },
      { source: 0, target: 7 },
      { source: 1, target: 7 },
      { source: 5, target: 0 }
    ];
    
    // SVG dimensions
    const width = 700;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2 + 40; // Add 40px margin below titles by shifting circle down
    const radius = Math.min(width, height) * 0.4;
    
    // Create SVG
    const svg = d3.select("#visualization")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);
    
    // Add a circular path representing the non-linear nature of time
    svg.append("path")
      .attr("d", d3.arc()({
        innerRadius: radius - 5,
        outerRadius: radius,
        startAngle: 0,
        endAngle: 2 * Math.PI
      }))
      .attr("fill", "#8884d8")
      .attr("opacity", 0.5);
    
    // Calculate node positions around the circle
    const nodePositions = moments.map((d, i) => {
      const angle = (i / moments.length) * 2 * Math.PI;
      return {
        ...d,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        angle
      };
    });
    
    // Add connection lines
    svg.selectAll(".connection")
      .data(connections)
      .enter()
      .append("path")
      .attr("class", "connection")
      .attr("d", d => {
        const source = nodePositions[d.source];
        const target = nodePositions[d.target];
        
        // Calculate control points for curved lines
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        
        // Create a curve that goes through the center for a more non-linear effect
        return `M${source.x},${source.y}Q0,0,${target.x},${target.y}`;
      })
      .attr("fill", "none")
      .attr("stroke", "#aaa")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.6);
    
    // Add nodes for each moment
    const nodes = svg.selectAll(".node")
      .data(nodePositions)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x}, ${d.y})`)
      .on("mouseover", (event, d) => {
        setHoveredNode(d);
        d3.select(event.currentTarget).select("circle")
          .transition()
          .duration(300)
          .attr("r", 12);
      })
      .on("mouseout", (event) => {
        setHoveredNode(null);
        d3.select(event.currentTarget).select("circle")
          .transition()
          .duration(300)
          .attr("r", 8);
      });
    
    nodes.append("circle")
      .attr("r", 8)
      .attr("fill", (d, i) => d3.schemeCategory10[i % 10]);
    
    nodes.append("text")
      .attr("dy", -16)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", "500")
      .text(d => d.name);
    
    // Add a title and subtitle with increased spacing
    svg.append("text")
      .attr("y", -radius - 60)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .text("Non-Linear Time Perception");
    
    svg.append("text")
      .attr("y", -radius - 35)
      .attr("text-anchor", "middle")
      .attr("font-size", "13px")
      .attr("font-style", "italic")
      .text("\"If you could see your whole life from start to finish...\"");
      
  }, []);
  
  return (
    <div className="flex flex-col items-center w-full p-4">
      <div id="visualization" className="w-full"></div>
      
      {hoveredNode && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg max-w-lg">
          <p className="text-lg font-semibold">{hoveredNode.name}</p>
          <p className="text-md italic">"{hoveredNode.quote}"</p>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-600 max-w-lg">
        <p>This visualization represents the non-linear perception of time described in the film "Arrival." 
        Rather than flowing in one direction, memories and moments connect across time, forming a circle where 
        past, present, and future exist simultaneously. Hover over nodes to see the related quotes.</p>
      </div>
    </div>
  );
};

export default NonLinearTimePerception;
