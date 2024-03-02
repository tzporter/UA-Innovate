// import * as d3 from 'd3'
import us from '../data/states-albers-10m.json'
import data from 

const width = 975;
const height = 610;
const path = d3.geoPath();

const svg = d3
.create('svg')
.attr('height', height)
.attr('width', width);

const statesBackground = svg
.append('path')
.attr('fill', '#ddd')
.attr('d', path(topojson.feature(us, us.objects.nation)));

const statesBorders = svg
.append('path')
.attr('fill', 'none')
.attr('stroke', '#fff')
.attr('stroke-linejoin', 'round')
.attr('stroke-linecap', 'round')
.attr('d', path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));

const stateCapitalElements = svg
.selectAll('g')
.data(data)
.join('g');

const capitalGroups = stateCapitalElements
.append('g')
.attr(
  'transform',
  ({ longitude, latitude }) =>
    `translate(${projection([longitude, latitude]).join(",")})`
);

capitalGroups.append('circle').attr('r', 2);

capitalGroups
.append('text')
.attr('font-family', 'sans-serif')
.attr('font-size', 10)
.attr('text-anchor', 'middle')
.attr('y', -6)
.text(({ description }) => description);

document.body.appendChild(svg.node())