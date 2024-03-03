import us from './data/states-albers-10m.json' assert { type: 'json' };
import data from './data/data.json' assert { type: 'json' };

const width = 975;
const height = 610;
const path = d3.geoPath();

const projection = d3.geoAlbersUsa().scale(1300).translate([width/2, height/2])

const svg = d3
.create('svg')
.attr("viewBox", [0, 0, width, height])
.attr('height', height)
.attr('width', width)
.attr("style", "max-width: 100%; height: auto;");

const statesBackground = svg
.append('path')
.attr('fill', '#ddd')
.attr('d', path(topojson.feature(us, us.objects.nation)));

statesBackground.on('click', ()=>separate())

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


let coords_dict = {}

const capitalGroups = stateCapitalElements
.append('g')
.attr(
  'transform',
  ({ longitude, latitude, facility_id }) => {
    const projected = projection([longitude, latitude]);
    projected[0] = projected[0] //- 10
    projected[1] = projected[1] //-14.625;
    coords_dict[facility_id] = projected
    return `translate(${projected.join(",")})`
  }
  )

  let keys = [Object.keys(coords_dict).length];
  let coords = [Object.keys(coords_dict).length];
  let i = 0;
  for(let key in coords_dict){
    keys[i] = key
    coords[i] = coords_dict[key]
    i++
  }  
  capitalGroups.append('circle')
  .attr("r", "5").attr('stroke', 'black').attr('fill', 'rgba(0,0,0,0)');
  
  capitalGroups.append('text');
  
  
capitalGroups
.on('mouseover', function (d, i) {
    d3.select(this).transition()
    .duration('200')
    .attr('filter', 'brightness(.5)')
})
.on('mouseout', function (d, i) {
  d3.select(this).transition()
       .duration('200')
       .attr('filter', 'brightness(1)');
});


document.body.appendChild(svg.node())



// capitalGroups
// .append('text')
// .attr('font-family', 'sans-serif')
// .attr('font-size', 10)
// .attr('text-anchor', 'middle')
// .attr('y', -6)
// .attr('font-family', 'FontAwesome')
// .text(({ facility_name }) => facility_name);
let k = 0;
function separate(){
  let coords_init = [coords.length]
  for(let i = 0; i < coords.length; i++){
    coords_init[i] = [2]
    coords_init[i][0] = coords[i][0]
    coords_init[i][1] = coords[i][1]
  }
  for(let i = 0; i < coords_init.length; i++){
    if(coords_init[i]!=coords[i]) console.log('mismatch')
  }
  k++
  let is_overlap = true
  let i = 0
  while(i<k){
    i++
    let min = 0
    console.log('running')
    is_overlap = false
    for(let i = 0; i<coords.length; i++){
      let coord1 = coords[i]
      let fx =  10*(coords_init[i][0] - coords[i][0])
      let fy = 10*(coords_init[i][1]  - coords[i][1])
      for(let j = 0; j < coords.length; j++){
        let coord2 = coords[j]
        if(i!=j){
          const fx_temp = .1/Math.pow((coord1[0]-coord2[0]),3)
          const fy_temp = .1/Math.pow((coord1[1]-coord2[1]),3)
          if(fx_temp!= Infinity)
            fx = fx+fx_temp
          if(fy_temp!= Infinity)
            fy = fy+fy_temp
          if (Math.abs(coord1[0]-coord2[0] + coord1[1]-coord2[1]) < 7.07){
            if(Math.abs(coords_init[i][0] - coords[i][0])>min){
              min = coords_init[i][0] - coords[i][0]
            }
            is_overlap = is_overlap || true
          }
        }
        //if(is_overlap) console.log(true)
      }
      coords[i][0] += fx
      coords[i][1] += fy
    }
    stateCapitalElements.selectAll('g')
    //.transition() // Apply transition to the selection
    .attr('transform', (d) => {
      //console.log('hey');
      //console.log(`translate(${coords_dict[d.facility_id][0]}, ${coords_dict[d.facility_id][1]})`);
      return `translate(${coords_dict[d.facility_id][0]}, ${coords_dict[d.facility_id][1]})`;
    });
    console.log(min)
  }
  coords_dict = {}
  for (let i = 0; i < coords.length; i++){
    coords_dict[keys[i]] = coords[i]
  }
  //console.log(capitalGroups.selectAll('g'))
  stateCapitalElements.selectAll('g')
  .transition() // Apply transition to the selection
  .attr('transform', (d) => {
    //console.log('hey');
    //console.log(`translate(${coords_dict[d.facility_id][0]}, ${coords_dict[d.facility_id][1]})`);
    return `translate(${coords_dict[d.facility_id][0]}, ${coords_dict[d.facility_id][1]})`;
  });
  capitalGroups.selectAll('circle').transition()
  .attr("r", "2")

}