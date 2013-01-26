
var preselected = null;
var preselectedAnnotations = null;
var preselectedHeatMaps = null;
var preselectedStartDate = null;
var preselectedEndDate = null;
var preselectedSleep = null;
var previousPoint = null;


var lineGraphData = [];
var symptomGraphData = [];
var sleepGraphData = [];
var personalisedGraphData = [];

function drawKeyGraph(divName, colour, pointStyle)
{
	var options = {
	    xaxis: {
	      max: 2,
	      min: 0
	    },
	    yaxis: {
	      min: 0,
	      max: 2
    	},
	    grid: {
	      show: false,
	      borderWidth: 1
	    }
	  };

	  var series = [{
	    data: [[-1,1],[1,1],[3,1]],
	    color: colour,
	    lines: {
	      lineWidth: 2,
	      show: true
	    },
	    points: {
	    	show: true,
	    	radius: 2,
	    	hoverable: false
	    },
	    shadowSize: 0
	  }];
	  
	  $.plot($('#' + divName), series , options );
}

function drawAnnotationKey(divName, colour)
{
	var options = {
	    xaxis: {
	      min: 0,
	      max: 2
	    },
	    yaxis: {
	      min: 0,
	      max: 2
    	},
	    grid: {
	      show: false,
	      borderWidth: 1
	    }
	  };

	  var series = [{
	    data: [[1,0],[1,2],"",[1,1],[2,1]],
	    color: colour,
	    lines: {
	      lineWidth: 2,
	      show: true
	    },
	    points: {
	    	show: false
	    },
	    shadowSize: 0
	  }];
	  
	  $.plot($('#' + divName), series , options );
}


function drawHMKeyGraph(divName, colour, pointStyle)
{
	var options = {
	    xaxis: {
	      max: 2,
	      min: 0
	    },
	    yaxis: {
	      min: 0,
	      max: 2
    	},
	    grid: {
	      show: false,
	      borderWidth: 1
	    }
	  };

	  var series = [{
	    data: [[-1,1],[1,1],[3,1]],
	    color: colour,
	    lines: {
	      lineWidth: 2,
	      show: false
	    },
	    points: {
	    	show: true,
	    	radius: 4,
	    	hoverable: false,
	    	fillColor: colour,
	    	fill: 1
	    },
	    shadowSize: 0
	  }];
	  
	  $.plot($('#' + divName), series , options );
}


function drawSleepKeyGraph()
{
	var options = {
	    xaxis: {
	      max: 2,
	      min: 0
	    },
	    yaxis: {
	      min: 0,
	      max: 2
    	},
	    grid: {
	      show: false,
	      borderWidth: 1
	    }
	  };

	  var series = [{
	    data: [[-1,1],[1,1],[3,1]],
	    color: '#800000',
	    lines: {
	      lineWidth: 2,
	      show: true
	    },
	    points: {
	    	show: true,
	    	radius: 2,
	    	hoverable: false
	    },
	    shadowSize: 0
	  }];
	  
	  $.plot($('#sleepKeyBedTime'), series , options );
	  series[0].color = '#008080';
	  $.plot($('#sleepKeyHours'), series , options );
}


var lineGraphStartDate = new Date();
var lineGraphFinishDate = new Date();

var lineGraphOptions = {
		legend: {
			show: true,
			margin: 10,
			backgroundOpacity: 0.5
			
		},
        xaxis: {
            mode: "time"
        },	
		yaxis: {
			tickSize: 5,
			min: 0,
			labelWidth: 90,
		    /*labelHeight: null or number */
		    reserveSpace: true
		},
        grid: { hoverable: true, borderWidth: 1}
};


function drawLineGraph()
{

	lineGraphStartDate = getRangeStartDate();
	lineGraphFinishDate = getRangeFinishDate();


	lineGraphOptions.xaxis.min = lineGraphStartDate.getTime();
	lineGraphOptions.xaxis.max = lineGraphFinishDate.getTime();

	lineGraphOptions.yaxis.min = getMinPossibleScore();
	lineGraphOptions.yaxis.max = getMaxPossibleScore();

	var selected = getSelectedGraphs();
	
	if(selected.length == 0)
	{
		//console.log('nothing to show');
		$('#lineGraph').hide();
		return;
	}
	$('#lineGraph').show();
		
	var graphData = [];

        // THIS IS WHERE THE GRAPH DATA IS USED!
        graphData = graphData.concat(graph1Data);
        graphData = graphData.concat(graph2Data);
    
	graph = $.plot($("#lineGraph"), graphData, lineGraphOptions );		        
	
    $('#lineGraph').bind("plothover", function (event, pos, item) {
    	//console.log(item);
	    if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;
                    //console.log(item.pageX + "," + item.pageY);
                    $("#tooltip").remove();
                    showTooltip(item.pageX, item.pageY, item.series.data[item.dataIndex][2]);
                }
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;            
            }
    });

}

var symptomGraphOptions = {
		legend: {
			show: false
		},
        xaxis: {
        	show: true,
        	mode: "time",
        	tickFormatter: function(n){ return "";}
        },	
		yaxis: {
			show: true,
			labelWidth: 90,
		    reserveSpace: true
		},
		series: { bubbles: {
			active: true,
			show: true,
			fill: true,
			lineWidth: 0,
			highlight: { opacity: 0.5 }
		}},
        grid: { hoverable: true,
        		borderWidth: 1}
		
};

function drawIndividualGraphs(url)
{
	lineGraphStartDate = getRangeStartDate();
	lineGraphFinishDate = getRangeFinishDate();

	//var options = symptomGraphOptions;
	
	symptomGraphOptions.xaxis.min = lineGraphStartDate.getTime();
	symptomGraphOptions.xaxis.max = lineGraphFinishDate.getTime();

	
	
	var selected = getSelectedHeatMaps();
	
	for(var i = 0; i < selected.length; i++)
	{
		
		var questionnaireID = selected[i];
		var id='#heatmap' + questionnaireID;
		var newUrl = url;
		
		//var graphData = [];
		if(!symptomGraphData[questionnaireID])
		{
			newUrl += '?questionnaireID=' + questionnaireID;
			$.ajax({
				url: newUrl,
				method: 'GET',
				dataType: 'json',
				success: function(series){ 
										symptomGraphData[questionnaireID] = series;
										},
				error: function(jqXHR, textStatus, errorThrown){
					console.log("error: " + errorThrown);
				},
				async: false
			});
		}
		
		//graphData = graphData.concat();
		symptomGraphOptions.yaxis.min = symptomGraphData[questionnaireID].min;
		symptomGraphOptions.yaxis.max = symptomGraphData[questionnaireID].max;
		symptomGraphOptions.yaxis.ticks = symptomGraphData[questionnaireID].ticks;

		//console.log(symptomGraphData[questionnaireID].data[0].data.length);
		//console.log(symptomGraphData[questionnaireID].data[1].data.length);

		// now reduce the number of points to plot so that they fit inside the box (flot bubbles bug)
		
		var graphDataArray = jQuery.extend(true, {}, symptomGraphData[questionnaireID]);
		var graphData = [];
		$.each(symptomGraphData[questionnaireID].data[0].data, function(k){
			//console.log(i);
		    if(symptomGraphData[questionnaireID].data[0].data[k][0] > lineGraphStartDate
		     && symptomGraphData[questionnaireID].data[0].data[k][0] < lineGraphFinishDate ) 
		    {
		    	graphData.push(symptomGraphData[questionnaireID].data[0].data[k]);
		    }
		    
		});
		graphDataArray.data[0].data = graphData;
		//console.log(symptomGraphData[questionnaireID].data[0].data);
		//console.log("called");
		//console.log(symptomGraphData[questionnaireID].data[1].data);
		graphData = [];
		$.each(symptomGraphData[questionnaireID].data[1].data, function(k){
			//console.log(symptomGraphData[questionnaireID].data[1].data[k]);
		    if(symptomGraphData[questionnaireID].data[1].data[k][0] > lineGraphStartDate
		     && symptomGraphData[questionnaireID].data[1].data[k][0] < lineGraphFinishDate ) 
		    {
		    	graphData.push(symptomGraphData[questionnaireID].data[1].data[k]);
		    	//console.log("included");
		    }
		    else{
		    	//console.log("excluded");
		    }
		});
		graphDataArray.data[1].data = graphData;
		
		graph = $.plot($(id), graphDataArray.data, symptomGraphOptions);		        
	
	    $(id).bind("plothover", function (event, pos, item) {
	    	 	
	    	 if (item) {
	    		//console.log(event);
	 		    if (previousPoint != item.dataIndex) {
	                    previousPoint = item.dataIndex;
	                    
	                    $("#tooltip").remove();
	                    showTooltip(pos.pageX, pos.pageY, item.series.data[item.dataIndex][3]);
	                }
	            }
	            else {
	                $("#tooltip").remove();
	                previousPoint = null;            
	            }
	    });
	}
}

var personalisedGraphOptions = {
		legend: {
			show: false
		},
        xaxis: {
            mode: "time"
        },	
		yaxis: {
            tickDecimals: 0,
			labelWidth: 90,
		    /*labelHeight: null or number */
		    reserveSpace: true
		    
		},
        grid: { hoverable: true,
        	borderWidth: 1}
        
		
};
function drawPersonalisedGraphs(url)
{
	lineGraphStartDate = getRangeStartDate();
	lineGraphFinishDate = getRangeFinishDate();

	//var options = symptomGraphOptions;
	
	personalisedGraphOptions.xaxis.min = lineGraphStartDate.getTime();
	personalisedGraphOptions.xaxis.max = lineGraphFinishDate.getTime();

	
	
	var selected = getSelectedPersonalisedGraphs();
	
	for(var i = 0; i < selected.length; i++)
	{
		
		var questionID = personalisedQuestions[selected[i]].questionID;
		var id='#personalisedquestiongraph' + questionID;
		
		//graphData = [];
		if(!personalisedGraphData[questionID])
		{
			$.ajax({
				url: url + '?questionID=' + questionID + '&startTime='+lineGraphStartDate.getTime() + '&endTime='+lineGraphFinishDate.getTime(),
				method: 'GET',
				dataType: 'json',
				success: function(series){ 
										personalisedGraphData[questionID] = series;
										},
				error: function(jqXHR, textStatus, errorThrown){
					console.log("error: " + errorThrown);
				},
				async: false
			});
		}
		//graphData = graphData.concat(personalisedGraphData[questionID].data);
		personalisedGraphOptions.yaxis.min = personalisedGraphData[questionID].min;
		personalisedGraphOptions.yaxis.max = personalisedGraphData[questionID].max;
		personalisedGraphOptions.yaxis.ticks = personalisedGraphData[questionID].ticks;
	
		//console.log(graphData);
		//console.log($(id));
		graph = $.plot($(id), personalisedGraphData[questionID].data, personalisedGraphOptions );		        
	
	    $(id).bind("plothover", function (event, pos, item) {
	    	 	
	    	 if (item) {
	    		//console.log(event);
	 		    if (previousPoint != item.dataIndex) {
	                    previousPoint = item.dataIndex;
	                    
	                    $("#tooltip").remove();
	                    showTooltip(pos.pageX, pos.pageY, item.series.data[item.dataIndex][2]);
	                }
	            }
	            else {
	                $("#tooltip").remove();
	                previousPoint = null;            
	            }
	    });
	}
}



function drawAllKeys()
{
	for(var i=0;i<lineGraphQuestionnaires.length;i++)
	{
		var key = 'key' + i;
		var colour = lineGraphQuestionnaires[i].colour;
		var pointStyle = lineGraphQuestionnaires[i].questionnairePointType;
		drawKeyGraph(key, colour, pointStyle);
	}

	

}


function getMinDate(){ 
	var minDate = new Date().getTime(); // today;
	$("input:checkbox[name=graphCheck]:checked").each(function() {
		if(lineGraphQuestionnaires[$(this).val()].earliestResponse < minDate)
			minDate = lineGraphQuestionnaires[$(this).val()].earliestResponse;   
	  });
	
	return minDate;
}

function getMaxDate(){ 
	var maxDate = new Date(2001,0,1); 
	$("input:checkbox[name=graphCheck]:checked").each(function() {
		if(lineGraphQuestionnaires[$(this).val()].latestResponse > maxDate)
			maxDate = lineGraphQuestionnaires[$(this).val()].latestResponse;
	  });

	return maxDate;
}

function getMinPossibleScore(){ 
	var minPossibleScore = 100;
	if($("input:checkbox[name=graphCheck]").length == 0)
	{
		return 0;
	}
	
	$("input:checkbox[name=graphCheck]:checked").each(function() {
		if(lineGraphQuestionnaires[$(this).val()].questionnaireMinPossibleScore < minPossibleScore)
			minPossibleScore = lineGraphQuestionnaires[$(this).val()].questionnaireMinPossibleScore;   
	  });
	return minPossibleScore;
}

function getMaxPossibleScore(){ 
	var maxPossibleScore = -100;
	if($("input:checkbox[name=graphCheck]").length == 0)
	{
		return 27;
	}
	$("input:checkbox[name=graphCheck]:checked").each(function() {
		if(lineGraphQuestionnaires[$(this).val()].questionnaireMaxPossibleScore > maxPossibleScore)
			maxPossibleScore = lineGraphQuestionnaires[$(this).val()].questionnaireMaxPossibleScore;
	  });
	return maxPossibleScore;
}

function getRangeStartDate(){
	
	if(preselectedStartDate != null){
		return preselectedStartDate;
	}

	
	if(!$("#rangeSelect").val())
	{
		var d = new Date();
		d.addMonths(-9);
		d.addDays(-3);
		return d;	
	}

	
	var lineGraphStartDate = new Date();
	
	var rangeSelect = $("#rangeSelect").val();
	if(rangeSelect == "1")
	{
		lineGraphStartDate = new Date(); // Today
		lineGraphStartDate.add(-1).months();
	}
	else if(rangeSelect == "3")
	{
		lineGraphStartDate = new Date(); // Today
		lineGraphStartDate.add(-3).months();
	}
	else if(rangeSelect == "6")
	{
		lineGraphStartDate = new Date(); // Today
		lineGraphStartDate.add(-6).months();
	}
	else if(rangeSelect == "9")
	{
		lineGraphStartDate = new Date(); // Today
		lineGraphStartDate.add(-9).months();
	}
	else if(rangeSelect == "12")
	{
		lineGraphStartDate = new Date(); // Today
		lineGraphStartDate.add(-12).months();
	}
	else if(rangeSelect == "full")
	{
		lineGraphStartDate = new Date(getMinDate() - (1000 * 60 * 60 * 24 * 5));
	}
	else if(rangeSelect == "period")
	{
		lineGraphStartDate = $("#dp1").datepicker("getDate");
	}
	$("#dp1").datepicker("setDate", lineGraphStartDate);
	return lineGraphStartDate;
}

function getRangeFinishDate(){
	
	if(preselectedEndDate != null){
		return preselectedEndDate;
	}
	
	if(!$("#rangeSelect").val())
	{
		var d = new Date();
		d.addDays(3);
		return d;
	}

	
	var lineGraphFinishDate = new Date();
	var rangeSelect = $("#rangeSelect").val();
	if(rangeSelect == "1")
	{
		lineGraphFinishDate = new Date();
		lineGraphFinishDate.add(5).days();
	}
	else if(rangeSelect == "3")
	{
		lineGraphFinishDate = new Date();
		lineGraphFinishDate.add(5).days();
	}
	else if(rangeSelect == "6")
	{
		lineGraphFinishDate = new Date();
		lineGraphFinishDate.add(5).days();
	}
	else if(rangeSelect == "9")
	{
		lineGraphFinishDate = new Date();
		lineGraphFinishDate.add(5).days();
	}
	else if(rangeSelect == "12")
	{
		lineGraphFinishDate = new Date();
		lineGraphFinishDate.add(5).days();
	}
	else if(rangeSelect == "full")
	{
		lineGraphFinishDate = new Date(getMaxDate() + (1000 * 60 * 60 * 24 * 5));
	}
	else if(rangeSelect == "period")
	{
		lineGraphFinishDate = $("#dp2").datepicker("getDate");
	}
	$("#dp2").datepicker("setDate", lineGraphFinishDate);
	return lineGraphFinishDate;
	
}

var newQAOptions = {
		legend: {
			show: false,
			margin: 10,
			backgroundOpacity: 0.5
			
		},

        xaxis: {
            mode: "time"/*,
            min: (new Date(2009, 4, 1)).getTime(),
            max: (new Date(2011, 5, 1)).getTime() */
            
        },	
		yaxes: [ { position: "right",
			//tickSize: 5,
			min: -27,
			max: 20,
			ticks: [[-27, "27"], [-20, "20"], [-10, "10"],0,5,10,15,20],
			tickColor: "#FFFFFF",
		    /*labelHeight: null or number */
		    reserveSpace: true,
		    labelWidth: 20

		}, 
		{ position: "left",
			//tickSize: 5,
			min: -27,
			max: 20,
			ticks: [[-22.5, "Severe"],[-11, "Moderate"],[0, "Stable"],[8, "Moderate"],[15, "Severe"]],
			tickColor: "#FFFFFF",
			labelWidth: 70

		}],
        grid: { 
        	hoverable: true,
        	borderWidth:2
        	//backgroundColor: { colors: ["#f8f8ff", "#fff"] }
		}
		
};


function drawNewQAGraph(url)
{
	lineGraphStartDate = getRangeStartDate();
	lineGraphFinishDate = getRangeFinishDate();

	newQAOptions.xaxis.min = lineGraphStartDate.getTime();
	newQAOptions.xaxis.max = lineGraphFinishDate.getTime();

	//newQAOptions.yaxis.min = getMinPossibleScore();
	//newQAOptions.yaxis.max = getMaxPossibleScore();

		
	var graphData = [];
	
	$.ajax({
		url: url,
		method: 'GET',
		dataType: 'json',
		success: function(series){ graphData = graphData.concat(series);},
		error: function(jqXHR, textStatus, errorThrown){
			console.log("error: " + errorThrown);
		},
		async: false
	});

	graph = $.plot($("#newqa"), graphData, newQAOptions );		        
    
	$('#newqa').bind("plothover", function (event, pos, item) {
	    if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;
                    
                    $("#tooltip").remove();
                    showTooltip(item.pageX, item.pageY, item.series.data[item.dataIndex][2]);
                    
                }
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;
                
            }
    });
	
	var o = graph.pointOffset({ x: lineGraphStartDate.getTime(), y: 1});
	$("#newqa").append('<div style="position:absolute;left:' + (o.left + 15) + 'px;top:' + (o.top + 15) + 'px;color:#666;font-size:smaller">QIDS</div>');
	$("#newqa").append('<div style="position:absolute;left:' + (o.left + 15) + 'px;top:' + (o.top - 15) + 'px;color:#666;font-size:smaller">ALTMAN</div>');


}




var resizeTimerID = null;
function onResize() {
    if (resizeTimerID == null) {
        resizeTimerID = window.setTimeout(function() {
            resizeTimerID = null;
            tl.layout();
        }, 500);
    }
}


var annotationGraphOptions = {
		legend: {
			show: false,
			margin: 10,
			backgroundOpacity: 0.5
			
		},
        xaxis: {
        	show: true,
        	mode: "time",
        	tickFormatter: function(n){ return "";}
        },	
		yaxis: {
			ticks: [],
			tickSize: 1,
			min: 0,
			labelWidth: 90,
		    /*labelHeight: null or number */
		    reserveSpace: true
		},
        grid: { hoverable: true, borderWidth: 0}
        
		
};

function getSelectedAnnotations(){
	if(preselected)
	{
		return preselected;
	}
	
	var selected = new Array();
	if($("input:checkbox[name=annotationsCheck]").length == 0)
	{
		return [];
		//selected.push(1);
		//selected.push(9);
	}
	else{
		$("input:checkbox[name=annotationsCheck]:checked").each(function() {
		       selected.push($(this).val());
		  });
	}
	return selected;

}


function getSelectedGraphs(){
	if(preselected)
	{
		return preselected;
	}
	
	var selected = new Array();
	if($("input:checkbox[name=graphCheck]").length == 0)
	{
		return [];
		//selected.push(1);
		//selected.push(9);
	}
	else{
		$("input:checkbox[name=graphCheck]:checked").each(function() {
		       selected.push(lineGraphQuestionnaires[$(this).val()].questionnaireID);
		  });
	}
	return selected;

}

function getSelectedHeatMaps(){
	if(preselectedHeatMaps)
	{
		return preselectedHeatMaps;
	}
	
	var selected = new Array();
	if($("input:checkbox[name=hmgraphCheck]").length == 0)
	{
		return [];
		//selected.push(1);
		//selected.push(9);
	}
	else{
		$("input:checkbox[name=hmgraphCheck]:checked").each(function() {
		       selected.push(lineGraphQuestionnaires[$(this).val()].questionnaireID);
		  });
	}
	return selected;

}

function getSelectedPersonalisedGraphs(){


	var selected = new Array();
	if($("input:checkbox[name=persgraphCheck]").length == 0)
	{
		return selected;
	}
	else{
		$("input:checkbox[name=persgraphCheck]:checked").each(function() {
		       selected.push($(this).val());
		  });
	}
	return selected;
	
	
	
}

/*function drawAnnotationGraph(url)
{

	annotationGraphStartDate = getRangeStartDate();
	annotationGraphFinishDate = getRangeFinishDate();


	annotationGraphOptions.xaxis.min = lineGraphStartDate.getTime();
	annotationGraphOptions.xaxis.max = lineGraphFinishDate.getTime();

	annotationGraphOptions.yaxis.min = 0;
	annotationGraphOptions.yaxis.max = 3;

	
	
	var graphData = [];
	
		$.ajax({
			url: url + '?startDate=' + annotationGraphStartDate + '&endDate=' + annotationGraphFinishDate,
			method: 'GET',
			dataType: 'json',
			success: function(series){ graphData = graphData.concat(series);},
			error: function(jqXHR, textStatus, errorThrown){
				console.log("error: " + errorThrown);
			},
			async: false
		});
	
	graph = $.plot($("#annotations"), graphData, annotationGraphOptions );		        
	
	var o = graph.pointOffset({ x: 1336647600000, y: 1});
	console.log(o);
	$("#annotations").append('<div id="annotation1" style="position:absolute;left:' + (o.left + 10) + 'px;top:' + (o.top - 18) + 'px;color:#666;font-size:smaller">My First Note</div>');
	$('#annotation1').mouseover(function(jsEvent) {
		showTooltip(jsEvent.pageX, jsEvent.pageY + 10, "Hello");
		});
}*/


var sleepGraphBedOptions = {
		legend: {
			show: true,
			margin: 2,
			backgroundOpacity: 0.5
			
		},
        xaxis: {
            mode: "time"
        },	
		yaxis: 
		{
			labelWidth: 90,
			position: "left",
			//min: 60 * 12,
			tickDecimals: 0,
			tickFormatter: function(v, axis) {
		        var hours = Math.floor(v / 60) % 24;
		        var minutes = (v % 60);
		        if(hours < 10)
		        	hours = "0" + hours;
		        if(minutes < 10)
		        	minutes = "0" + minutes;
				return "" + hours + ':' + minutes;
		     },
		    /*labelHeight: null or number */
		    reserveSpace: true
		},
        grid: { hoverable: true, borderWidth: 1}
};

var sleepGraphHoursOptions = {
		legend: {
			show: true,
			margin: 2,
			backgroundOpacity: 0.5
			
		},
        xaxis: {
            mode: "time"
        },	
		yaxis: 
		{
			position: "left",
			min: 0,
			labelWidth: 90,
			/*labelHeight: null or number */
		    reserveSpace: true
		},
        grid: { hoverable: true, borderWidth: 1}
};

function drawSleepGraph(url)
{

	sleepGraphStartDate = getRangeStartDate();
	sleepGraphFinishDate = getRangeFinishDate();


	sleepGraphBedOptions.xaxis.min = sleepGraphStartDate.getTime();
	sleepGraphBedOptions.xaxis.max = sleepGraphFinishDate.getTime();

	sleepGraphHoursOptions.xaxis.min = sleepGraphStartDate.getTime();
	sleepGraphHoursOptions.xaxis.max = sleepGraphFinishDate.getTime();


/*	lineGraphOptions.yaxis.min = getMinPossibleScore();
	lineGraphOptions.yaxis.max = getMaxPossibleScore();
*/
	var selected = getSleepSelected();
	if(selected.length == 0)
	{
		$('#sleepGraphDiv').hide();
		return;
	}
	
	$('#sleepGraphDiv').show();
	var graphData = [];
	
	for(var i = selected.length - 1; i >= 0; i--)
	{
		if(!sleepGraphData[selected[i]])
		{
			$.ajax({
				url: url,
				method: 'GET',
				dataType: 'json',
				success: function(series){ 
					//console.log(series);
					sleepGraphData[0] = series[1];
					sleepGraphData[1] = series[0];
				},
				error: function(jqXHR, textStatus, errorThrown){
					console.log("error: " + errorThrown);
				},
				async: false
			});
		
		}
		graphData = graphData.concat(sleepGraphData[selected[i]]);
		
		
	}
	
	
	
	//graph = $.plot($("#dailySleepGraph"), graphData, sleepGraphOptions );		        
	graph = $.plot($("#dailySleepHoursGraph"), sleepGraphData[1], sleepGraphHoursOptions );		        
	graph = $.plot($("#dailySleepBedGraph"), sleepGraphData[0], sleepGraphBedOptions );		        
	
    $('#dailySleepBedGraph').bind("plothover", function (event, pos, item) {
    	//console.log(item);
	    if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;
                    //console.log(item.pageX + "," + item.pageY);
                    $("#tooltip").remove();
                    showTooltip(item.pageX, item.pageY, item.series.data[item.dataIndex][2]);
                }
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;
            }
    });

    $('#dailySleepHoursGraph').bind("plothover", function (event, pos, item) {
    	//console.log(item);
	    if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;
                    //console.log(item.pageX + "," + item.pageY);
                    $("#tooltip").remove();
                    showTooltip(item.pageX, item.pageY, item.series.data[item.dataIndex][2]);
                }
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;
            }
    });

}

function getSleepSelected(){

	if(preselectedSleep)
	{
		return preselectedSleep;
	}
	var selected = new Array();
	if($("input:checkbox[name=sleepGraphCheck]").length == 0)
	{
		return [];
	}
	else{
		$("input:checkbox[name=sleepGraphCheck]:checked").each(function() {
		       selected.push($(this).val());
		  });
	}
	return selected;
}


function organizeAnnotations(annotations, min, max){
	// This should receive annotations in date order
	// Annotation has startDate, endDate, 
	var lines = [];
	var maxDates = [];
	
	lines.push([]);
	maxDates.push(0);
	
	for(var a=annotations.length-1;a>=0;a--)
	{
		var i = 0;
		var thisAnnotation = annotations[a];
		var startDate = thisAnnotation.start;
		while(maxDates[i] > startDate)
		{
			i++;
		}
		if(!lines[i])
		{
			lines.push([]);
			maxDates.push(0);
		}
		lines[i].push(thisAnnotation);
		var m = thisAnnotation.end;
		
		var minLength = getAnnotationWidthInMS(thisAnnotation.title, min, max);
		
		// if the annotation is going to start off the edge of the graph, but continue into it,
		// we'll start it at the edge of the graph.
		if(startDate < min && thisAnnotation.end > min)
		{
			startDate = min;
		}
		
		if(startDate + minLength > m)
		{
			m = startDate + minLength;
		}
		maxDates[i] = m;
	}
	
	return lines;
}

function drawAnnotations(){
	
	var annotationsDiv = $("#annotationsDiv");
	annotationsDiv.html('');
	
	lineGraphStartDate = getRangeStartDate();
	lineGraphFinishDate = getRangeFinishDate();

	lineGraphStartDate = lineGraphStartDate.getTime(); // convert from datetime to milis
	lineGraphFinishDate = lineGraphFinishDate.getTime(); // convert from datetime to milis
	
	var colours = getSelectedAnnotations();
	//console.log(colours);
	//console.log("in array: 'blue', ['blue']", $.inArray('blue', ["blue"]));
	var filteredAnnotations = $.grep(annotations, function(element, index){
		return ($.inArray("" + element.color,colours) > -1);
    });
	
	
	
	
	var newAnnotations = organizeAnnotations(filteredAnnotations, lineGraphStartDate, lineGraphFinishDate); 
	
	//console.log(newAnnotations);
	
	annotationsDiv.height('' + (newAnnotations.length * 3) + 'em');

	//console.log(newAnnotations.length);
	
	var annotationHeight = getAnnotationHeight('Ty');
	
	var options = {
	        xaxis: {
	            mode: "time",
	            min : lineGraphStartDate,
	            max : lineGraphFinishDate,
	            show : false
	        },	
			yaxis: {
				min: -1,
				max: newAnnotations.length,
				labelWidth: 90,
			    reserveSpace: true,
			    show: false
			},
			series: {
		        lines: { show: true },
		        points: { show: false }
		    },
			grid: {
				show: true,
				color: 'white'
			}
		    /*grid: { hoverable: true, borderWidth: 1, color: 'white'}*/
		    
		};
	
	var lineData = [];
	var endBarData = [];
	
	for(var c=0;c<colours.length;c++)
	{
		lineData.push(	{
			color: colours[c],
			data: []
		});
		endBarData.push(	{
			color: colours[c],
			data: []
		});

	}
	
	for(var l=0;l<newAnnotations.length;l++)
	{
		var thisLine = newAnnotations[l]; 
		for(var a=0;a<thisLine.length;a++)
		{
			var thisAnnotation = thisLine[a];
			var index = $.inArray(thisAnnotation.color,colours);
			lineData[index].data.push([thisAnnotation.start, l ]);
			lineData[index].data.push([thisAnnotation.end, l]);
			lineData[index].data.push('');
			endBarData[index].data.push([thisAnnotation.start, l + 0.4 ]);
			endBarData[index].data.push([thisAnnotation.start, l - 0.2]);
			endBarData[index].data.push('');
			endBarData[index].data.push([thisAnnotation.end, l]);
			endBarData[index].data.push([thisAnnotation.end, l - 0.2]);
			endBarData[index].data.push('');
		}
	}
	//console.log("lineData: " + lineData);
	
	var data = [];
	for(var c=0;c<colours.length;c++)
	{
		data.push(lineData[c]);
		data.push(endBarData[c]);
	}
	
	
	//console.log(data);
	
	
	
	
	var plot = $.plot(annotationsDiv, data, options);
	
	
	for(var l=0;l<newAnnotations.length;l++)
	{
		var thisLine = newAnnotations[l]; 
		for(var a=0;a<thisLine.length;a++)
		{
			
			var thisAnnotation = thisLine[a];
			o = plot.pointOffset({ x: thisAnnotation.start, y: l});
			if(thisAnnotation.start < lineGraphStartDate && thisAnnotation.end > lineGraphStartDate)
			{
				o = plot.pointOffset({ x: lineGraphStartDate, y: l});
			}
			var div = '<div class="graphAnnotation tickLabel" style="left:' + (o.left + 5) + 'px;top:' + (o.top - annotationHeight - 2)  + 'px;">' + thisAnnotation.title + '</div>';

			jQuery(div)
			.bind('mouseenter', function(event) { $("#tooltip").remove(); showTooltip(event.pageX, event.pageY, $(this).attr('tooltip'));})
			.bind('mouseleave', function(event) { $("#tooltip").remove();})
			.attr('tooltip', thisAnnotation.tooltip)
			.appendTo(annotationsDiv);
			
			//annotationsDiv.append(div);
			
	
		}
	}
}

function getAnnotationWidth(str){
	$("#testAnnotationSize").text(str);
	return ($("#testAnnotationSize")[0].clientWidth + 1);
}

function getAnnotationWidthInMS(str, min, max){
	// min and max are the (date-valued) extremes of the graph
	//console.log('min: ' + min);
	//console.log('max: ' + max);
	// width in pixels of the annotation
	var wp = getAnnotationWidth(str) + 20;
	//console.log('wp: ' + wp);
	// total width in pixels of the graph div (this includes axis labels, but that will serve nicely as a buffer?)
	var twp = $("#annotationsDiv").width();
	//console.log('twp: ' + twp);
	
	var wd = ((max - min) * wp ) / twp;
	//console.log('wd: ' + wd);
	return wd;
	
}

function getAnnotationHeight(str){
	$("#testAnnotationSize").text(str);
	return ($("#testAnnotationSize")[0].clientHeight + 1);
}