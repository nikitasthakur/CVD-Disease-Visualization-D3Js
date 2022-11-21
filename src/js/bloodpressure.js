// load data
var data;
async function load_data() {
  data = await d3.csv('./data/final_data.csv');
  draw(data);
}
const bp_svg = d3.select("#blood_pressure").append("svg");
load_data();

// filter values
var disease = document.getElementById("diseases");
var gender = document.getElementById("gender");
var disease_code = document.getElementById("disease_code");
// console.log(disease_val, gender_val, code_val)

function filter_data() {
  var gender_val = gender.value;
  var disease_val = disease.value;
  var code_val = disease_code.value;
  var dataset = data;

  if (gender_val != 'both' && gender_val != 'select') {
    gender_val = gender_val.toUpperCase();
    dataset = dataset.filter(function (row) {
      return row.SEX == gender_val;
    });
  };

  if (code_val != 'both' && code_val != 'select') {
    code_val = code_val.toUpperCase();
    dataset = dataset.filter(function (row) {
      return row.Diagnosis_Code == code_val;
    });
  };

  console.log('dataset', dataset)
  bp_svg.selectAll('*').remove();
  draw(dataset);


};

function draw(dataset) {
  const xAccessor = (d) => Number(d.systolic);
  const yAccessor = (d) => Number(d.diastolic);

  let dimensions = {
    width: 500,
    height: 500,
    margin: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
    },
  };

  dimensions.containerWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.containerHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;


  bp_svg.attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const container = bp_svg
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.margin.left}, ${dimensions.margin.top})`
    );

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .clamp(true)
    .range([0, dimensions.containerWidth]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .clamp(true)
    .range([dimensions.containerHeight, 0]);

  container
    .selectAll("circle")
    .data(dataset)
    .join("circle")
    .attr("r", 5)
    .attr("fill", "red")
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)));

  // Axes
  const xAxis = d3.axisBottom(xScale);

  const xAxisGroup = container
    .append("g")
    .call(xAxis)
    .style("transform", `translateY(${dimensions.containerHeight}px)`)
    .classed("axis", true);

  // already positioned at bottom
  xAxisGroup
    .append("text")
    .attr("x", dimensions.containerWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .text("Systolic (mmHg)");

  const yAxis = d3.axisLeft(yScale);

  const yAxisGroup = container.append("g").call(yAxis).classed("axis", true);

  yAxisGroup
    .append("text")
    .attr("x", -dimensions.containerHeight / 2)
    .attr("y", -dimensions.margin.left + 15)
    .attr("fill", "black")
    .html("Diastolic (mmHg)")
    .style("transform", "rotate(270deg)")
    .style("text-anchor", "middle");

  container.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top * 3))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Systolic vs Diastolic B.P.");
};

