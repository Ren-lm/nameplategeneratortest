function preload()
{
	//do not use
	//do not delete
}

function setup()
{
	//do not use
	//do not delete
}

function draw()
{
	//do not use
	//do not delete
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////					/////////////////////////////////////////////////////////////////////////////////////////
////////////////////			GLOBALS			/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////					/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var namesPanelContainer;
var previewPanelContainer;
var templatesPanelContainer;
var GLOBAL_ROW_HEIGHT = 50;
var GLOBAL_COLUMN_DIVISION = 22;
var GLOBAL_COLUMN_WIDTH;// = namesPanelContainer.size().width / GLOBAL_COLUMN_DIVISION;
var GLOBAL_NAMES_LIST = [];
var GLOBAL_NAMES_HEADER;
var GLOBAL_DEFAULT_IMAGE;
var GLOBAL_REFRESH_FLAG = false;
var GLOBAL_TEMPLATES_LIST = [];
var headerOffsetMultiplier = 3;
var GLOBAL_DEFAULT_SUBTEXT = "";
var GLOBAL_DEFAULT_COLOR = "#000000";
var GLOBAL_PAGE_WIDTH = 595; //page width - (CAREFUL WITH THIS VALUE - IT BREAKS STUFF FOR LITERALLY NO REASON)
var GLOBAL_PAGE_HEIGHT = 841;

var PDF;
var headerFont;


var trashcanAR;
var trashcanMain;
var trashcanHighlightMain;

var GLOBAL_LIST_OF_IMAGES = [];

var imagelist = {
	
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////					/////////////////////////////////////////////////////////////////////////////////////////
////////////////////		NAMES PANEL			/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////					/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//all names canvas should be prefrixed with names
var namesP5 = function (names)
{
	var newRowButton;
	var numberOfRowsPerPage = 17;
	var isNamesListHidden = false;
	var currentRowIndexImageSelection;
	const IMAGE_COLUMN_AMOUNT = 4;
	var IMAGE_BLOCK_SIZE;
	var imageRows;
	var imageDrawCounter = 0;
	var namesPanelCanvasSizeUpdateFlag = false;


	//var trashcanActiveMain = null;
	names.preload = function()
	{
		headerFont = loadFont('assets/Gobold Regular.otf');
		
		for (let i = 1; i <= 54; i++)
		{
			if(GLOBAL_LIST_OF_IMAGES.length == 0)
			{
				GLOBAL_LIST_OF_IMAGES[0] = null;
				continue;
			}

			loadImage("assets/100x100p/" + i + ".png", imageTemp =>
			{
				var temp = new ImageFormatting(names);
				temp.setImage(imageTemp);
				temp.setPadding(5);

				GLOBAL_LIST_OF_IMAGES[GLOBAL_LIST_OF_IMAGES.length] = temp;
			});
		}
		
		loadImage("assets/Trashcan Icon/trashcan4.png", trashcantemp =>
		{
			trashcanMain = trashcantemp;
			trashcanAR = trashcantemp.width/trashcantemp.height;
			
			//trashcanActiveMain = trashcanMain;
		});

		loadImage("assets/Trashcan Icon/trashcan2.png", trashcanHtemp =>
		{
			trashcanHighlightMain = trashcanHtemp;
		});

		loadImage("assets/100x100p/noImage.png", imageTemp =>
		{
			var temp = new ImageFormatting(names);
			temp.setImage(imageTemp);
			temp.setPadding(5);

			GLOBAL_LIST_OF_IMAGES[0] = temp;
		});

		
	}
	
	names.setup = function()
	{
		names.textFont(headerFont);
		
		namesPanelContainer = select('#names-panel-container');
		var namesPanelCanvas = names.createCanvas(namesPanelContainer.size().width, namesPanelContainer.size().height);
		namesPanelCanvas.mousePressed(names.checkIfMouseClicked);
		namesPanelCanvas.mouseOver(names.checkIfMouseHovered);
		GLOBAL_COLUMN_WIDTH = namesPanelContainer.size().width / GLOBAL_COLUMN_DIVISION;
		GLOBAL_ROW_HEIGHT = namesPanelContainer.size().height / numberOfRowsPerPage;
		namesPanelCanvas.parent('names-panel-container');
		
		newRowButton = createButton("ADD ROW");
		newRowButton.parent(namesPanelContainer);
		newRowButton.position(0, (GLOBAL_NAMES_LIST.length+headerOffsetMultiplier)* GLOBAL_ROW_HEIGHT);
		newRowButton.size(namesPanelContainer.size().width, GLOBAL_ROW_HEIGHT);
		newRowButton.mouseClicked(names.initNewRow);
		
		GLOBAL_NAMES_HEADER = new HeaderFormatting(names);
		GLOBAL_NAMES_HEADER.setup();
		namesPanelCanvas.mouseOver(names.checkIfMouseHoveredHeader);
		//GLOBAL_NAMES_HEADER.setPosition(0);
		GLOBAL_NAMES_HEADER.setPadding(0,0);
		GLOBAL_NAMES_HEADER.setGlobalRowSize(namesPanelContainer.size().width, GLOBAL_ROW_HEIGHT*headerOffsetMultiplier, headerOffsetMultiplier);
		GLOBAL_NAMES_HEADER.refreshPageData();
		
		
		
		//---------------------------------- // TEST DATA //-----------------------------------------------------------
		names.initNewRow();
		GLOBAL_NAMES_LIST[0].rowData.setData(10, false, "Didier", "subtext1", "#0000ff", "assets/100x100p/27.png");
		GLOBAL_NAMES_LIST[0].refreshPageData();

		names.initNewRow();
		GLOBAL_NAMES_LIST[1].rowData.setData(5, true, "JD", "subtext2 bing bong", "#f00fff", "assets/100x100p/26.png");
		GLOBAL_NAMES_LIST[1].refreshPageData();

		names.initNewRow();
		GLOBAL_NAMES_LIST[2].rowData.setData(1, true, "BRIAN", "SUBTEXT TESTING", "#ff0000", "assets/100x100p/21.png");
		GLOBAL_NAMES_LIST[2].refreshPageData();
		
		for(let i = 3; i <= 50; i++)
		{
			// let r = floor(random(0,255));
			// let g = floor(random(0,255));
			// let b = floor(random(0,255));
			// let randomColor = hex(55,0,10);
			// console.log(randomColor);


			names.initNewRow();
			GLOBAL_NAMES_LIST[i].rowData.setData(i, true, "NAME "+ i, "subtext " + i, "#000000", "assets/100x100p/" + i + ".png");
			GLOBAL_NAMES_LIST[i].refreshPageData();
		}

		
		
		names.refreshArrayIndices();
		//---------------------------------- // TEST DATA //-----------------------------------------------------------

		IMAGE_BLOCK_SIZE = namesPanelContainer.width/IMAGE_COLUMN_AMOUNT;
		imageRows = Math.floor(GLOBAL_LIST_OF_IMAGES.length/IMAGE_COLUMN_AMOUNT)+1;
		
		
		
		
	}

	
	names.checkIfMouseClicked = function()
	{
		//IMAGES SCREEN
		if(isNamesListHidden)
		{
			for (const image in GLOBAL_LIST_OF_IMAGES)
			{
				
				
				if(GLOBAL_LIST_OF_IMAGES[image].tryClick(names))
				{
					//Global image selection
					if(GLOBAL_NAMES_HEADER.imageSelectFlag)
					{
						for (const name in GLOBAL_NAMES_LIST) 
						{
							if(!GLOBAL_NAMES_LIST[name].getEnabled())
							{
								continue;
							}
							
							if(image == 0)
							{
								GLOBAL_NAMES_LIST[name].imageDisabled = true;
							}
							else
							{
								GLOBAL_NAMES_LIST[name].imageDisabled = false;
							}
							
							GLOBAL_NAMES_LIST[name].setImage(GLOBAL_LIST_OF_IMAGES[image].image);
							GLOBAL_NAMES_LIST[name].saveData();
						}
						GLOBAL_NAMES_HEADER.setImage(GLOBAL_LIST_OF_IMAGES[image].image);
						GLOBAL_NAMES_HEADER.imageSelectFlag = false;
						GLOBAL_DEFAULT_IMAGE = GLOBAL_LIST_OF_IMAGES[image].image;
					}
					//Normal image selection
					else
					{
						//console.log(image);
						if(image == 0)
						{
							GLOBAL_NAMES_LIST[currentRowIndexImageSelection].imageDisabled = true;
						}
						else
						{
							GLOBAL_NAMES_LIST[currentRowIndexImageSelection].imageDisabled = false;
						}
						GLOBAL_NAMES_LIST[currentRowIndexImageSelection].setImage(GLOBAL_LIST_OF_IMAGES[image].image);
						GLOBAL_NAMES_LIST[currentRowIndexImageSelection].saveData();
					}
					
					isNamesListHidden = false;
					names.showNamesList();
					names.updateCanvasSize();
					
				}
			}
		}
		else 
		{
			GLOBAL_NAMES_HEADER.mousePressed(names);
			
			names.deleteAllNames();
			
			for (const name in GLOBAL_NAMES_LIST)
			{
				GLOBAL_NAMES_LIST[name].mousePressed(names);
			}
			
		}
		
		
	}

	names.draw = function()
	{
		imageRows = Math.floor(GLOBAL_LIST_OF_IMAGES.length/IMAGE_COLUMN_AMOUNT)+1;
		imageDrawCounter = 0;

		names.background(255,255,255,150);

		names.checkIfMouseHovered();

		if(!isNamesListHidden)
		{

			names.drawNamesScreen();

			names.checkHeaderOperationFlags();



		}
		//IMAGE SCREEN
		else
		{
			names.drawImageScreen();

		}

	}

	names.drawNamesScreen = function()
	{
		GLOBAL_NAMES_HEADER.draw();

		//Checks for delete flags and draws each row
		for (let i = 0; i < GLOBAL_NAMES_LIST.length; i++)
		{
			if(GLOBAL_NAMES_LIST[i].deleteFlag)
			{
				GLOBAL_NAMES_LIST[i].deleteAllHTML();
				GLOBAL_NAMES_LIST.splice(i,1);
				names.refreshArrayIndices();
				names.updateCanvasSize();
				continue;
			}


			if(GLOBAL_NAMES_LIST[i].imageSelectFlag)
			{
				this.hideNamesList();
				currentRowIndexImageSelection = i;
				namesPanelCanvasSizeUpdateFlag = true;
				GLOBAL_NAMES_LIST[i].imageSelectFlag = false;
				//GLOBAL_NAMES_LIST[i].draw();
				break;
			}
			
			GLOBAL_NAMES_LIST[i].draw();

		}

		//updates "add row" button position (required if new rows are added/removed)
		newRowButton.position(GLOBAL_ROW_HEIGHT/4, GLOBAL_ROW_HEIGHT/4); //(GLOBAL_NAMES_LIST.length+headerOffsetMultiplier)* GLOBAL_ROW_HEIGHT
		newRowButton.size(100,GLOBAL_ROW_HEIGHT/2);
	}

	names.checkHeaderOperationFlags = function()
	{
		if(GLOBAL_REFRESH_FLAG)
		{
			names.refreshArrayIndices();
			GLOBAL_REFRESH_FLAG = false;
		}

		if(GLOBAL_NAMES_HEADER.imageSelectFlag)
		{
			this.hideNamesList();
			namesPanelCanvasSizeUpdateFlag = true;
		}

		if(GLOBAL_NAMES_HEADER.getEnabledToggleFlag())
		{
			names.toggleEnabledCheckboxes();
		}

		if(GLOBAL_NAMES_HEADER.getColorSelectFlag())
		{
			names.setAllColors();
		}

		if(GLOBAL_NAMES_HEADER.getSubtextChangedFlag())
		{
			names.setAllSubtexts();
		}
	}

	names.drawImageScreen = function()
	{
		for (let i = 0; i < imageRows; i++)
		{
			for (let j = 0; j < IMAGE_COLUMN_AMOUNT; j++)
			{
				if(imageDrawCounter >= GLOBAL_LIST_OF_IMAGES.length)
				{
					continue;
				}

				GLOBAL_LIST_OF_IMAGES[imageDrawCounter].setPosition(j*IMAGE_BLOCK_SIZE, i*IMAGE_BLOCK_SIZE);
				GLOBAL_LIST_OF_IMAGES[imageDrawCounter].setSize(IMAGE_BLOCK_SIZE, IMAGE_BLOCK_SIZE);
				GLOBAL_LIST_OF_IMAGES[imageDrawCounter].draw();

				imageDrawCounter++;

			}
		}

		if(namesPanelCanvasSizeUpdateFlag)
		{
			names.updateCanvasSizeForImages();
			namesPanelCanvasSizeUpdateFlag = false;
		}
	}
	
	
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////				CORE END					//////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	
	
	
	
	names.deleteAllNames = function()
	{
		if(!GLOBAL_NAMES_HEADER.deleteFlag)
		{
			return;
		}
		
		for (const name in GLOBAL_NAMES_LIST)
		{
			if(!GLOBAL_NAMES_LIST[name].getEnabled())
			{
				continue;
			}
			GLOBAL_NAMES_LIST[name].deleteFlag = true;
		}

		GLOBAL_NAMES_HEADER.deleteFlag = false;
		names.refreshArrayIndices();
	}

	names.checkIfMouseHovered = function()
	{
		if(isNamesListHidden)
		{
			for (const image in GLOBAL_LIST_OF_IMAGES)
			{
				GLOBAL_LIST_OF_IMAGES[image].mouseOver(names);
				
			}
		}
		else {
			for (const name in GLOBAL_NAMES_LIST)
			{
				GLOBAL_NAMES_LIST[name].mouseOver(names);
			}
		}
		
		
	}

	names.checkIfMouseHoveredHeader = function()
	{
		if(!isNamesListHidden)
		{
			GLOBAL_NAMES_HEADER.mouseOver(names);
			
		}

	}
	
	names.hideNamesList = function()
	{
		isNamesListHidden = true;
		newRowButton.addClass("force-hide");
		GLOBAL_NAMES_HEADER.hideRow();
		
		for (const name in GLOBAL_NAMES_LIST)
		{
			GLOBAL_NAMES_LIST[name].hideRow();
		}
	}

	names.showNamesList = function()
	{
		isNamesListHidden = false;
		newRowButton.removeClass("force-hide");
		GLOBAL_NAMES_HEADER.showRow();

		for (const name in GLOBAL_NAMES_LIST)
		{
			GLOBAL_NAMES_LIST[name].showRow();
		}
	}
	
	//Updates Canvas size if rows become more than the height of the canvas
	names.updateCanvasSize = function()
	{
		if((GLOBAL_NAMES_LIST.length+headerOffsetMultiplier) * GLOBAL_ROW_HEIGHT > namesPanelContainer.size().height)
		{
			names.resizeCanvas(namesPanelContainer.size().width, (GLOBAL_NAMES_LIST.length+headerOffsetMultiplier) * GLOBAL_ROW_HEIGHT);
		}
		else
		{
			names.resizeCanvas(namesPanelContainer.size().width, namesPanelContainer.size().height);
		}
	}

	names.updateCanvasSizeForImages = function()
	{
		if(imageRows * IMAGE_BLOCK_SIZE  > namesPanelContainer.size().height)
		{
			//console.log("update cnvs");
			names.resizeCanvas(namesPanelContainer.size().width, imageRows * IMAGE_BLOCK_SIZE);
		}
		else
		{
			//console.log("reset cnvs");
			names.resizeCanvas(namesPanelContainer.size().width, namesPanelContainer.size().height);
		}
	}
	
	//Initialises new default row
	names.initNewRow = function()
	{
		//specific handle for when list is empty
		if(GLOBAL_NAMES_LIST.length == 0)
		{
			var temp = new RowFormatting(names);
			temp.setup();
			temp.setPosition(0);
			temp.setPadding(0,0);
			temp.setGlobalRowSize(namesPanelContainer.size().width, GLOBAL_ROW_HEIGHT);
			temp.refreshPageData();
			//temp.setTrashcanImages(trashcanMain,trashcanHighlightMain);
			GLOBAL_NAMES_LIST[GLOBAL_NAMES_LIST.length] = temp;
			
		}
		else
		{
			var temp = new RowFormatting(names);
			temp.setup();
			temp.setPosition(GLOBAL_NAMES_LIST.length);
			temp.setPadding(0,0);
			temp.setGlobalRowSize(namesPanelContainer.size().width, GLOBAL_ROW_HEIGHT);
			//temp.setTrashcanImages(trashcanMain,trashcanHighlightMain);
			GLOBAL_NAMES_LIST[GLOBAL_NAMES_LIST.length] = temp;

			//fullNamesList[fullNamesList.length-1].rowData.setData(2, false, "Didier", "subtext1", "#ffff00", "assets/100x100p/27.png");
			GLOBAL_NAMES_LIST[GLOBAL_NAMES_LIST.length-1].refreshPageData();
			
		}

		newRowButton.position(0, (GLOBAL_NAMES_LIST.length+headerOffsetMultiplier)* GLOBAL_ROW_HEIGHT);
		names.updateCanvasSize();
		
		//revisit using this here - quick hack to save data on new row added (does this need dedicated button)?
		names.refreshArrayIndices();
		
	}
	
	//Resets IDs when an item is deleted
	names.refreshArrayIndices = function()
	{
		for (let i = 0; i < GLOBAL_NAMES_LIST.length; i++)
		{
			GLOBAL_NAMES_LIST[i].setID(i);
			GLOBAL_NAMES_LIST[i].setPosition(i);
			GLOBAL_NAMES_LIST[i].saveData();
			GLOBAL_NAMES_LIST[i].refreshPageData();
			
		}
	}
	
	names.toggleEnabledCheckboxes = function ()
	{
		if(!GLOBAL_NAMES_HEADER.getEnabledToggleFlag())
		{
			
			return;
		}

		for (let i = 0; i < GLOBAL_NAMES_LIST.length; i++)
		{
			GLOBAL_NAMES_LIST[i].setEnabled(GLOBAL_NAMES_HEADER.getEnabled());
			GLOBAL_NAMES_LIST[i].refreshPageData();
			GLOBAL_NAMES_LIST[i].saveData();

		}
		
		GLOBAL_NAMES_HEADER.setEnabledToggleFlag(false);
		names.refreshArrayIndices();
	}
	
	names.setAllColors = function()
	{
		if(!GLOBAL_NAMES_HEADER.getColorSelectFlag())
		{
			return;
		}
		
		

		for (let i = 0; i < GLOBAL_NAMES_LIST.length; i++)
		{
			if(!GLOBAL_NAMES_LIST[i].getEnabled())
			{
				continue;
			}
			GLOBAL_NAMES_LIST[i].setColor(GLOBAL_NAMES_HEADER.getColor());
			GLOBAL_NAMES_LIST[i].refreshPageData();
			GLOBAL_NAMES_LIST[i].saveData();

		}
		
		GLOBAL_NAMES_HEADER.setColorSelectFlag(false);
		names.refreshArrayIndices();
	}
	
	names.setAllSubtexts = function()
	{
		if(!GLOBAL_NAMES_HEADER.getSubtextChangedFlag())
		{
			return;
		}
		
		for (let i = 0; i < GLOBAL_NAMES_LIST.length; i++)
		{
			if(!GLOBAL_NAMES_LIST[i].getEnabled())
			{
				continue;
			}
			GLOBAL_NAMES_LIST[i].setSubtext(GLOBAL_NAMES_HEADER.getSubtext());
			GLOBAL_NAMES_LIST[i].refreshPageData();
			GLOBAL_NAMES_LIST[i].saveData();

		}

		GLOBAL_NAMES_HEADER.setSubtextChangedFlag(false);
		names.refreshArrayIndices();
		
	}
	
	
};

new p5(namesP5);






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////					/////////////////////////////////////////////////////////////////////////////////////////
////////////////////		PREVIEW PANEL		/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////					/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//all preview canvas should be prefrixed with names
var previewP5 = function (preview)
{
	var refresh = false;
	var totalHeight = 0;
	var totalHeightMultiplier =1;
	
	
	preview.setup = function()
	{
		previewPanelContainer = select('#preview-panel-container');
		var previewPanelCanvas = preview.createCanvas(GLOBAL_PAGE_WIDTH, GLOBAL_PAGE_HEIGHT);//namesPanelContainer.size().width
    	previewPanelCanvas.parent('preview-panel-container');

		
		
		var saveButton = createButton("SAVE");
		//saveButton.parent(previewPanelContainer);
		saveButton.position(previewPanelContainer.size().width*1.5, previewPanelContainer.size().height +10);
		saveButton.mouseClicked(preview.saveDocument);

		//var refreshButton = createButton("REFRESH");
		//refreshButton.parent(previewPanelContainer);
		//refreshButton.position(previewPanelContainer.size().width/2 - 100, previewPanelContainer.size().height +10);
		//refreshButton.mouseClicked(preview.refreshDocument);

		this.pageCount = 1;
	}
	
	preview.saveDocument = function()
	{
		//let pdfCanvas = createCanvas(595, 841);
		
		//preview.noLoop();
		preview.refreshDocument();
		preview.generatePDF();
		// PDF.save();
		// PDF.endRecord();
		//totalHeight = 0;
		//this.pageCount = 1;
		
	}
	
	

	preview.refreshDocument = function()
	{
		if(refresh)
		{
			return;
		}

		refresh = true;
		this.pageCount = 1;

	}
	
	preview.generatePDF = function()
	{
		//Dont loop if refresh flag is not set to true (VERY IMPORTANT)
		if(!refresh)
		{
			return;
		}

		if(GLOBAL_PAGE_HEIGHT != preview.height)
		{
			console.log("RESIZED FRO PDF");
			preview.resizeCanvas(GLOBAL_PAGE_WIDTH, GLOBAL_PAGE_HEIGHT);
		}
		
		//preview.resizeCanvas(595,841);

		//Create fresh PDF
		PDF = preview.createPDF();
		PDF.beginRecord();

		//Clean background
		preview.background(255);
		
		// //loop through all templates
		for (let i = 0; i < GLOBAL_TEMPLATES_LIST.length; i++)
		{
			let template = GLOBAL_TEMPLATES_LIST[i];

			//Check if the template is selected by the user or not
			//console.log(template.isNotSelected);
			if(template.getSelectState())
			{
				//If it is not selected, skip this template
				continue;
			}

			// number of templates per row.
			// connect this parameter with user input.
			let numOfTempPreRow = 2;

			let rate = 1 / numOfTempPreRow;

			let calculatedX = 0;
			let calculatedY = 0;

			template.setRate(rate);

			let h = template.getCurrentHeight();
			let w = floor(GLOBAL_PAGE_WIDTH/numOfTempPreRow);//template.getCurrentWidth();
			let col = 0;
			let row = 0;
			let counter = 0;
			//let offsetflag = 0;

			//draw vertical cut line
			preview.stroke(0, 0, 0, 50);
			preview.strokeWeight(1);
			preview.line(GLOBAL_PAGE_WIDTH/numOfTempPreRow, 0, GLOBAL_PAGE_WIDTH/numOfTempPreRow, previewPanelContainer.size().height);


			//For the current template (i), iterate through all names (j)
			for (let j = 0; j < GLOBAL_NAMES_LIST.length; j++)
			{
				if(!GLOBAL_NAMES_LIST[j].getEnabled())
				{
					continue;
				}
				
				col = counter % numOfTempPreRow;

				row = Math.floor( counter / numOfTempPreRow);

				let startingX = col * w;

				let startingY = row * h;

				//draw horizontal cut line
				preview.stroke(0, 0, 0, 50);
				preview.strokeWeight(1);
				preview.line(startingX, startingY + h, GLOBAL_PAGE_WIDTH, startingY + h)

				if(startingY + h > previewPanelContainer.size().height) //if the next name will be out of bounds
				{
					
					counter = 0 //reset positional counters
					j--;		//rerun previous name again
					this.pageCount++;	//Keeps track of the amount of pages sofar
					PDF.nextPage();		//Lets save current canvas to new PDF page
					preview.background(255);	//Clear Background
					//draw vertical cut line
					preview.stroke(0);
					preview.strokeWeight(1);
					preview.line(GLOBAL_PAGE_WIDTH/numOfTempPreRow, 0, GLOBAL_PAGE_WIDTH/numOfTempPreRow, previewPanelContainer.size().height);
					continue;	

				}
				

				template.drawAutoAdjustTempalte(preview, GLOBAL_NAMES_LIST[j], startingX, startingY, rate);// example parameters (nameData, x, y, w)

				counter++;
			}


		}
		refresh = false;
		PDF.save();
		PDF.endRecord();
		//preview.saveDocument();
		
		
	}
	
	preview.displayViewCanvas = function()
	{
		//Clean background
		preview.background(255);

		// //loop through all templates
		for (let i = 0; i < GLOBAL_TEMPLATES_LIST.length; i++)
		{
			let template = GLOBAL_TEMPLATES_LIST[i];

			//Check if the template is selected by the user or not
			//console.log(template.isNotSelected);
			if(template.getSelectState())
			{
				//If it is not selected, skip this template
				continue;
			}

			// number of templates per row.
			// connect this parameter with user input.
			let numOfTempPreRow = 2;

			let rate = 1 / numOfTempPreRow;

			let calculatedX = 0;
			let calculatedY = 0;

			template.setRate(rate);

			let h = template.getCurrentHeight();
			let w = floor(GLOBAL_PAGE_WIDTH/numOfTempPreRow);//template.getCurrentWidth();
			let col = 0;
			let row = 0;
			let counter = 0;
			//let totalHeightMultiplier = 1;

			//draw vertical cut line
			preview.stroke(0, 0, 0, 50);
			preview.strokeWeight(1);
			preview.line(GLOBAL_PAGE_WIDTH/numOfTempPreRow, 0, GLOBAL_PAGE_WIDTH/numOfTempPreRow, previewPanelContainer.size().height);


			//For the current template (i), iterate through all names (j)
			for (let j = 0; j < GLOBAL_NAMES_LIST.length; j++)
			{
				if(!GLOBAL_NAMES_LIST[j].getEnabled())
				{
					continue;
				}

				col = counter % numOfTempPreRow;

				row = Math.floor( counter / numOfTempPreRow);

				let startingX = col * w;

				let startingY = row * h;

				//draw horizontal cut line
				preview.stroke(0, 0, 0, 50);
				preview.strokeWeight(1);
				preview.line(startingX, startingY + h, GLOBAL_PAGE_WIDTH, startingY + h)

				if(startingY + h > (GLOBAL_PAGE_HEIGHT * totalHeightMultiplier)) //if the next name will be out of bounds
				{
					totalHeightMultiplier++;
					//counter += numOfTempPreRow //reset positional counters
					// j--;		//rerun previous name again
					// this.pageCount++;	//Keeps track of the amount of pages sofar
					// PDF.nextPage();		//Lets save current canvas to new PDF page
					// preview.background(255);	//Clear Background
					// //draw vertical cut line
					// preview.stroke(0);
					// preview.strokeWeight(1);
					// preview.line(GLOBAL_PAGE_WIDTH/numOfTempPreRow, 0, GLOBAL_PAGE_WIDTH/numOfTempPreRow, previewPanelContainer.size().height);
					// continue;

				}
				
				


				template.drawAutoAdjustTempalte(preview, GLOBAL_NAMES_LIST[j], startingX, startingY, rate);// example parameters (nameData, x, y, w)

				counter++;
			}

			if((GLOBAL_PAGE_HEIGHT * totalHeightMultiplier) != preview.height && !refresh)
			{
				console.log("RESIZE");
				preview.resizeCanvas(GLOBAL_PAGE_WIDTH, (GLOBAL_PAGE_HEIGHT * totalHeightMultiplier))
			}
		}
	}

	preview.draw = function()
	{	
		//preview.noLoop();
		
		//preview.generatePDF();
		preview.displayViewCanvas();
		
		
		if(frameCount % (60) == 0)
		{
			//this.refreshDocument();
		}
		


	}
	
};

new p5(previewP5);

//preview.line(startingX, startingY, w * numOfTempPreRow, startingY);
// some examples
// GLOBAL_TEMPLATES_LIST[1].SetName(GLOBAL_NAMES_LIST[0].getName());
// GLOBAL_TEMPLATES_LIST[i].draw();
// GLOBAL_TEMPLATES_LIST[i].setPos(x,y);


// if (frameCount == 60*60)
// {
//   generatePDF();
// }


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////					/////////////////////////////////////////////////////////////////////////////////////////
////////////////////		TEMPLATES PANEL		/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////					/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
  
	This is a template P5 class function.
  	'templates' parameter is an canvas pobject.

*/
var templatesP5_fnc = function (templates)
{	
	var tempOne;


	templates.preload = function(){

		templates.img = templates.loadImage("assets/100x100p/1.png");

	}



	templates.setup = function()
	{
		//select DOM container of our 'template' canvas.
		var templatesPanelContainer = select('#templates-panel-container');

		//create a 'tempalte' Canvas object.
		var templatesPanelCanvas = templates.createCanvas(templatesPanelContainer.size().width,  templatesPanelContainer.size().height);

		//make DOM container as our canvas's parent element.
		templatesPanelCanvas.parent('templates-panel-container');

		//set up base size
		//GLOBAL_COLUMN_WIDTH = templatesPanelCanvas.size().width / GLOBAL_COLUMN_DIVISION; <-- not what global_Column_width is used for
		

		// templatesPanelCanvas.mousePressed(templates.checkIfMouseClicked);
		// templatesPanelCanvas.mouseOver(templates.checkIfMouseHovered);

		templates.containerStartX = templatesPanelContainer.elt.offsetLeft;
		templates.containerStartY = templatesPanelContainer.elt.offsetTop;
		templates.containerW = templatesPanelContainer.elt.offsetWidth;
		templates.containerH = templatesPanelContainer.elt.offsetHeight;

		tempOne  = new TemplateOne(templates);
		tempOne.init();
		GLOBAL_TEMPLATES_LIST[0] = tempOne;


	}




	templates.draw = function()
	{

		//test code
		templates.hight = templates.height;
		templates.width = templates.width;
		//templates.background(255,255,255,150);
		
		let rate = 1/2;
		
		templates.push();
		templates.fill(211);
		templates.rect(0,0, templates.containerW, tempOne.getDefaultHeight() * rate );
		templates.pop();

		tempOne.drawAutoAdjustTempalte(templates, GLOBAL_NAMES_LIST[0], 0,0, rate);
		
		// tempOne.drawAutoAdjustTempalte(GLOBAL_NAMES_LIST[1], tempOne.getDefaultWidth() * rate, 0, rate);

		tempOne.drawCheckBox(tempOne.checkboxEventHandler);

	}



	templates.checkIfMouseClicked = function (){
		console.log("mouse clicked");

	}
	templates.checkIfMouseHovered = function (){
		console.log("mouse over");
	}
};

var templatesP5 =  new p5(templatesP5_fnc);


/*
	TemplateRow should only do drawing on provided position, and TempalteRow should have fixed height and width.

	There sould also be a function find_position() focus on calculating starting X, starting Y, ending X, ending Y, 

	This templates should draw 2 nameTags per row.

	for each nameTag:
	1. startingX: we pass as parameter,
	2. stratingY: we pass as parameter,
*/


function TemplateOne(canvas) {
	//two templates one row

	// create selectBox for display purpose.

	/**
	 * 	default width = 576,
	 * 	default height = 300,
	 * 	we first calculate ratio rateW, rateH.
	 * 	then use ratio to calculate paddingX, paddingY, startingX, startingY. 
	 * 
	 */
	var self = this;
	
	self.isNotSelected = false;

	self.init = function () {

        //---------------------------------/  ENABLED  /--------------------------------------
		self.checkbox = canvas.createElement("input");
		self.checkbox.attribute("type", "checkbox");
		self.checkbox.attribute("id", "template-one-checkBox");
		self.checkbox.position(0, 0);
		self.checkbox.parent(select('#templates-panel-container'));
		self.checkbox.mouseClicked(self.checkboxEventHandler);



		self.rate = 1;
		self.defaultW = GLOBAL_PAGE_WIDTH;
		self.defaultH = 300;
		self.W = (GLOBAL_PAGE_WIDTH) * self.rate;
		self.H = 300 * self.rate;
		self.round = 40 * self.rate;
		self.padding =1;//Math.floor(30 * self.rate);

		self.strokeWidth = 10;

	}

	self.update = function () {
		self.W = GLOBAL_PAGE_WIDTH * self.rate;
		self.H = 300 * self.rate;
		self.round = 40 * self.rate;
		self.padding = 1;//Math.floor(30 * self.rate);
	}

	self.setRate = function (rate) {
		
		self.rate = rate;

		self.update();
	}

	self.getCurrentWidth = function(){
		return self.W;
	}
	self.getCurrentHeight = function () {
		return self.H;
	}

	self.setSelectState = function(state) {
		self.isNotSelected = state;
	}

	self.getSelectState = function () {
		return self.isNotSelected;
	}

	self.getDefaultWidth = function () {
		return self.defaultW;
	}

	self.getDefaultHeight = function () {
		return self.defaultH;
	}
	self.drawCheckBox = function () {

		//draw checkbox
		self.checkbox.position(canvas.containerW*3/4, self.H/2);
	}


	self.drawAutoAdjustTempalte = function (c, data, startingX, startingY, rate) {

		
		if (data == null) {return;}
		
		self.rate = rate;
		self.update();


		//c.strokeWeight(3);
		//c.stroke(0);
		c.noStroke();
		c.fill(data.getColor())
		c.rect(startingX + self.padding,
			startingY + self.padding,
			self.W - self.padding * 2 ,
			self.H - self.padding * 2 ,
			self.round);

		c.fill(255);
		c.rect(startingX + self.padding + self.strokeWidth/2,
			startingY + self.padding + self.strokeWidth/2,
			self.W - self.padding * 2 - self.strokeWidth,
			self.H - self.padding * 2 - self.strokeWidth,
			self.round);


		// draw names
		c.push();
		c.noStroke();
		c.textAlign(CENTER, BOTTOM);
		let name = data.getName();

		//calculate the font size based the length of the string
		let text_width = (self.W - self.padding * 4) * 2 / 3;
		let nameSize = text_width * 3 / (3 * name.length);
		nameSize = Math.max(12, Math.min(nameSize, 50 * self.rate));

		c.textSize(nameSize);

		c.fill(data.getColor());
		c.text(name,
			startingX + self.padding * 2 + 0,
			startingY + self.padding * 2 + 0,
			(self.W - self.padding * 4) * 2 / 3,
			self.H / 2 - self.padding * 2);

		c.pop();


		//draw subtext

		c.push();
		c.stroke(51);
		c.noStroke();
		c.fill(data.getColor());
		c.textAlign(CENTER, TOP);
		let subTextSize = 3 + text_width * 3 / (3 * data.getSubtext().length);
		subTextSize = Math.max(6, Math.min(subTextSize, 35 * self.rate));

		c.textSize(subTextSize);
		c.text(data.getSubtext(),
			startingX + self.padding * 2 + 0,
			startingY + self.padding + self.H / 2,
			(self.W - self.padding * 4) * 2 / 3,
			self.H / 2 - self.padding * 2);

		c.pop();
		
		
		//draw image
		
		if(!data.imageDisabled)
		{
			c.push();
			c.imageMode(CENTER);

			c.image(data.getImage(),
				startingX - self.padding + self.W - self.W / 4,
				startingY + self.H / 2,
				self.W / 3 - self.padding * 2,
				self.W / 3 - self.padding * 2,
			);
			c.pop();
		}
		



		// c.push();
		// c.drawingContext.setLineDash([5,5]);
		// c.line(startingX + self.W/3, startingY + 0,startingX +self.W/3,self.H);
		// c.line(startingX + self.W*2/3,startingY +  0, startingX +self.W*2/3, self.H);
		// c.stroke(100);
		// c.line(startingX + 0, self.H/2, startingX + self.W, self.H/2);
		// c.pop();
	};


	self.checkboxEventHandler = function(){
		let input = select('#template-one-checkBox');
		if(input.checked()){
			console.log("checked");
			self.setSelectState(false);
			console.log(self.getSelectState);

		}
		else{
			console.log("not checked");
			self.setSelectState(true);
			console.log(self.getSelectState);
		}
	}
}


