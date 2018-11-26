import * as d3 from 'd3'

let margin = { top: 100, left: 50, right: 150, bottom: 30 }

let height = 700 - margin.top - margin.bottom

let width = 600 - margin.left - margin.right

let svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let parseTime = d3.timeParse('%Y')

let xPositionScale = d3.scaleLinear().range([0, width])
let yPositionScale = d3.scaleLinear().range([height, 0])

let colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
  ])

let line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.TIV)
  })

d3.csv(require('./data/top_5_tiv.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  datapoints.forEach(d => {
    d.datetime = parseTime(d.Year)
  })
  let dates = datapoints.map(d => d.datetime)
  let TIV = datapoints.map(d => +d.TIV)

  xPositionScale.domain(d3.extent(dates))
  yPositionScale.domain(d3.extent(TIV))

  let nested = d3
    .nest()
    .key(function(d) {
      return d.Exporter_Country
    })
    .entries(datapoints)
    console.log(datapoints)

//   svg
//     .append('text')
//     .attr('font-size', '24')
//     .attr('text-anchor', 'middle')
//     .text('U.S. housing prices fall in winter')
//     .attr('x', width / 2)
//     .attr('y', -40)
//     .attr('dx', 40)

  let rectWidth =
    xPositionScale(parseTime('1998')) -
    xPositionScale(parseTime('1996'))

  let rectWidth2 =
    xPositionScale(parseTime('1998')) -
    xPositionScale(parseTime('1997'))

  let xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%Y'))
    .ticks(11)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  let yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  d3.select('#graph-2').on('stepin', () => {
    console.log('show-blank-graph')
    svg
      .selectAll('.highlight-all')
      .attr('fill', 'none')
      .attr('stroke', 'none')
    svg
      .selectAll('.tiv-line')
      .transition()
      .remove()
    svg
      .selectAll('.tiv-circle')
      .transition()
      .remove()
    svg
      .selectAll('.country-text')
      .transition()
      .remove() 
    svg
      .selectAll('rect')
      .transition()
      .remove()


  })

  d3.select('#drawlines').on('stepin', () => {
    console.log('step one')
    // draw lines here
    svg
      .selectAll('.tiv-line')
      .data(nested)
      .enter()
      .append('path')
      .transition()
      .attr('class', 'tiv-line')
      .attr('d', function(d) {
        return line(d.values)
      })
      .attr('stroke', function(d) {
        return colorScale(d.key)
      })
      .attr('stroke-width', 2)
      .attr('fill', 'none')
//     // draw circles here
    svg
      .selectAll('.tiv-circle')
      .data(nested)
      .enter()
      .append('circle')
      .attr('class', 'tiv-circle')
      .transition()
      .attr('fill', function(d) {
        return colorScale(d.key)
      })
      .attr('r', 2)
      .attr('cy', function(d) {
        return yPositionScale(d.values[27].TIV)
      })
      .attr('cx', function(d) {
        return xPositionScale(d.values[27].datetime)
      })
//     // write text here
    svg
      .selectAll('.country-text')
      .data(nested)
      .enter()
      .append('text')
      .attr('class', 'country-text')
      .attr('y', function(d) {
        return yPositionScale(d.values[27].TIV)
        //console.log("value is", yPositionScale(d.values[1].TIV))
      })

      .attr('x', function(d) {
        return xPositionScale(d.values[27].datetime)
      })
      .text(function(d) {
        return d.key
      })
      .attr('dx', 6)
      .attr('dy', 4)
      .attr('font-size', '9')

      .attr('alignment-baseline', 'middle')
      .attr('dy', d => {
        if (d.key === 'China') {
          return 6
        } else {
          return 0
        }
      })  


  })

  d3.select('#highlightUS').on('stepin', () => {
    console.log('highligh-us')
    svg.selectAll('.tiv-circle').attr('fill', d => {
      if (d.key === 'United States of America') {
        return 'red'
      } else {
        return 'lightgrey'
      }
    })
    svg.selectAll('.tiv-line').attr('stroke', d => {
      if (d.key === 'United States of America') {
        return 'red'
      } else {
        return 'lightgrey'
      }
    })
  })

//   d3.select('#highlightRegions').on('stepin', () => {
//     console.log('highlight-region')
//     var upperRegions = [
//       'Mountain',
//       'Pacific',
//       'West South Central',
//       'South Atlantic'
//     ]
//     svg.selectAll('.price-circle').attr('fill', d => {
//       if (upperRegions.indexOf(d.key) !== -1) {
//         return 'lightblue'
//       } else if (d.key === 'U.S.') {
//         return 'red'
//       } else {
//         return 'lightgrey'
//       }
//     })
//     svg
//       .selectAll('.region-text')
//       .attr('fill', d => {
//         if (d.key === 'U.S.') {
//           return 'red'
//         } else {
//           return 'lightgrey'
//         }
//       })
//       .style('font-weight', 800)

//     svg.selectAll('.price-line').attr('stroke', d => {
//       if (upperRegions.indexOf(d.key) !== -1) {
//         return 'lightblue'
//       } else if (d.key === 'U.S.') {
//         return 'red'
//       } else {
//         return 'lightgrey'
//       }
//     })
//   })


  d3.select('#drawRectangle').on('stepin', () => {
    console.log('draw-rectangle')
    svg
      .append('rect')
      .attr('x', xPositionScale(parseTime('1996')))
      .attr('y', 0)
      .attr('width', rectWidth)
      .attr('height', height)
      .attr('fill', '#C2DFFF')
      .lower()
  })

  d3.select('#drawRectangle2').on('stepin', () => {
    console.log('draw-rectangle2')
    svg
      .append('rect')
      .attr('x', xPositionScale(parseTime('2000')))
      .attr('y', height-yPositionScale(9500))
      .attr('width', rectWidth)
      .attr('height', yPositionScale(9500))
      .attr('fill', '#C2DFFF')
      .lower()
  })

  d3.select('#highlightRussia').on('stepin', () => {
    console.log('highlightRussia')
    svg
      .selectAll('rect')
      .transition()
      .remove()

    svg.selectAll('.tiv-circle').attr('fill', d => {
      if (d.key === 'Russia') {
        return 'red'
      } else {
        return 'lightgrey'
      }
    })
    svg.selectAll('.tiv-line').attr('stroke', d => {
      if (d.key === 'Russia') {
        return 'red'
      } else {
        return 'lightgrey'
      }
    })  


  })

  d3.select('#drawRectangle3').on('stepin', () => {
    console.log('draw-rectangle3')
    svg
      .append('rect')
      .attr('x', xPositionScale(parseTime('1990')))
      .attr('y', height-yPositionScale(13000))
      .attr('width', rectWidth2)
      .attr('height', yPositionScale(13000))
      .attr('fill', '#C2DFFF')
      .lower()
  })  

  d3.select('#drawRectangle4').on('stepin', () => {
    console.log('draw-rectangle4')
    svg
      .append('rect')
      .attr('x', xPositionScale(parseTime('2010')))
      .attr('y', height-yPositionScale(5300))
      .attr('width', rectWidth)
      .attr('height', yPositionScale(5300))
      .attr('fill', '#C2DFFF')
      .lower()

    svg
      .selectAll('.highlight-all')
      .attr('fill', 'none')
      .attr('stroke', 'none')

  })


}