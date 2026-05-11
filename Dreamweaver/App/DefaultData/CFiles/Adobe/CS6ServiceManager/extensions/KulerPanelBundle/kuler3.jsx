/*
@@@BUILDINFO@@@ kuler3.jsx 3.0.0.12 16-September-2009
*/
//Point Product: ID
//Get Fill color
// returns the Color data type
function kulerGetFillForeColor()
{
	var strXMLResult = '<object><property id="bSuccess">';
	try
	{
	if('undefined' != typeof app && app.documents)
		{
			var fillColor = app.strokeFillProxySettings.fillColor;
			if( null != fillColor && 'undefined' != typeof fillColor.colorValue && 'undefined' != typeof fillColor.space)
            { 
                var colorArr = fillColor.colorValue;
                if(fillColor.space != ColorSpace.rgb)
                {
    				if(fillColor.space == ColorSpace.cmyk)		
    				{
    				    var c = parseFloat(colorArr[0]) ;		
        				var m = parseFloat(colorArr[1]) ;
        				var y = parseFloat(colorArr[2]) ;
    				    var k = parseFloat(colorArr[3]) ;
    
    				      var fillActiveColor; 
					if(app.documents.length)
						fillActiveColor = app.activeDocument.colors.add({model:fillColor.model, space:fillColor.space,colorValue:[c,m,y,k]});
					else
						fillActiveColor = app.colors.add({model:fillColor.model, space:fillColor.space,colorValue:[c,m,y,k]});

    			  	}
    				else
    				{
    				    var l = parseFloat(colorArr[0]) ;		
        				var a = parseFloat(colorArr[1]) ;
        				var b = parseFloat(colorArr[2]) ;
    				      
					var fillActiveColor;
					if(app.documents.length)
						fillActiveColor = app.activeDocument.colors.add({model:fillColor.model, space:fillColor.space,colorValue:[l,a,b]});
    					else
						fillActiveColor = app.colors.add({model:fillColor.model, space:fillColor.space,colorValue:[l,a,b]});
				}
    				fillActiveColor.space = ColorSpace.rgb;
    				colorArr = fillActiveColor.colorValue;
				if(app.documents.length)
					app.activeDocument.colors.item(fillActiveColor.name.toString()).remove();
				else
					app.colors.item(fillActiveColor.name.toString()).remove();
				
				}

				var r = parseFloat(colorArr[0])/255 ;		
    			var g = parseFloat(colorArr[1])/255 ;
    			var b = parseFloat(colorArr[2])/255 ;
                strXMLResult += '<true/></property>';
    			strXMLResult += '<property id="strError"><string></string></property>';
    			strXMLResult += '<property id="color"><object>';
    			strXMLResult += '<property id="r"><number>' +r+ '</number></property>';
    			strXMLResult += '<property id="g"><number>' +g+ '</number></property>';
    			strXMLResult += '<property id="b"><number>' +b+ '</number></property>';
    			strXMLResult += '</object></property>';
    		}
    		else
	       {
            	strXMLResult += '<false/></property>';
            	strXMLResult += '<property id="strError"><string>FillWrongSwatch</string></property>';
		   }
		}
	   else
        {
		strXMLResult += '<false/></property>';
		strXMLResult += '<property id="strError"><string>NoDocForFillErrTxt</string></property>';
        }
	}
	catch(err)
	{
		strXMLResult = '<object><property id="bSuccess">';
		strXMLResult += '<false/></property>';
		strXMLResult += '<property id="strError"><string>ForegroundUnknownErrTxt</string></property>';
		}
	strXMLResult += '</object>';
	return strXMLResult;
}

//Get Stroke color
// returns the Color data type
function kulerGetStrokeBackColor()
{
	var strXMLResult = '<object><property id="bSuccess">';
	try
	{
	if('undefined' != typeof app && app.documents)
		{
			var fillColor = app.strokeFillProxySettings.strokeColor;
			if( null != fillColor && 'undefined' != typeof fillColor.colorValue && 'undefined' != typeof fillColor.space)
            { 
                
    			var colorArr = fillColor.colorValue;
    			if(fillColor.space != ColorSpace.rgb)
				{
    				if(fillColor.space == ColorSpace.cmyk)		
    				{
    				    var c = parseFloat(colorArr[0]) ;		
        				var m = parseFloat(colorArr[1]) ;
        				var y = parseFloat(colorArr[2]) ;
    				    var k = parseFloat(colorArr[3]) ;
    
    				    var fillActiveColor; 
					if(app.documents.length)
						fillActiveColor = app.activeDocument.colors.add({model:fillColor.model, space:fillColor.space,colorValue:[c,m,y,k]});
					else
						fillActiveColor = app.colors.add({model:fillColor.model, space:fillColor.space,colorValue:[c,m,y,k]});

    			  	}
    				else
    				{
    				    var l = parseFloat(colorArr[0]) ;		
        				var a = parseFloat(colorArr[1]) ;
        				var b = parseFloat(colorArr[2]) ;
    				    	var fillActiveColor;
					if(app.documents.length)
						fillActiveColor = app.activeDocument.colors.add({model:fillColor.model, space:fillColor.space,colorValue:[l,a,b]});
    					else
						fillActiveColor = app.colors.add({model:fillColor.model, space:fillColor.space,colorValue:[l,a,b]});

    				}
    				fillActiveColor.space = ColorSpace.rgb;
    				colorArr = fillActiveColor.colorValue;
				if(app.documents.length)
					app.activeDocument.colors.item(fillActiveColor.name.toString()).remove();
				else
					app.colors.item(fillActiveColor.name.toString()).remove();
                }

    			var r = parseFloat(colorArr[0])/255 ;		
    			var g = parseFloat(colorArr[1])/255 ;
    			var b = parseFloat(colorArr[2])/255 ;
    			strXMLResult += '<true/></property>';
    			strXMLResult += '<property id="strError"><string></string></property>';
    			strXMLResult += '<property id="color"><object>';
    			strXMLResult += '<property id="r"><number>' +r+ '</number></property>';
    			strXMLResult += '<property id="g"><number>' +g+ '</number></property>';
    			strXMLResult += '<property id="b"><number>' +b+ '</number></property>';
    			strXMLResult += '</object></property>';
    		}
    	   else
	       {
            	strXMLResult += '<false/></property>';
            	strXMLResult += '<property id="strError"><string>StrokeWrongSwatch</string></property>';
		   }
		}
	   else
	   {
		strXMLResult += '<false/></property>';
		strXMLResult += '<property id="strError"><string>NoDocForStrokeErrTxt</string></property>';
		}
	}
	catch(err)
	{
		strXMLResult = '<object><property id="bSuccess">';
		strXMLResult += '<false/></property>';
		strXMLResult += '<property id="strError"><string>ForegroundUnknownErrTxt</string></property>';
		}
	strXMLResult += '</object>';
	return strXMLResult;
}

// Add to Swatch
//works only for RGB based swatches.
var kulerAddToSwatch = function(strData)
{
	var strResult = '<object><property id="bSuccess">';
	try{
		var xmlData = new XML(kulerParse(strData));
		if('undefined' != typeof app
			&& 'undefined' != typeof xmlData
			)
		{
			for(var i=0;i < xmlData.theme.swatches.children().length(); i++)
			{
				var col = xmlData.theme.swatches.swatch[i];
				var swatchColorModel;
				if((col.attribute.toLowerCase() == "localprocess") || (col.attribute.toLowerCase() == "globalprocess"))
				{
					swatchColorModel = ColorModel.process;
				}
			   else if(col.attribute.toLowerCase() == "spot")
				{
					swatchColorModel = ColorModel.spot;
			    }
		      else if(col.attribute.toLowerCase() == "registration")
				{
					swatchColorModel = ColorModel.registration;
				}
		      else
				{
					throw 'err';
				}
			
			
			var iCount = 0;
			if(app.documents.length)
				colorToAdd = app.activeDocument.colors.item(col.label.toString());
			else
				colorToAdd = app.colors.item(col.label.toString());
			var Swatchname = col.label.toString();
			while((('undefined' != typeof colorToAdd) && (null != colorToAdd)) || ((Swatchname == "[Registration]")||(Swatchname == "[None]")||(Swatchname == "[Black]") ))
			{
					++iCount;
					Swatchname = col.label.toString()+" "+ iCount;
					if(app.documents.length)
						colorToAdd = app.activeDocument.colors.item(Swatchname);
					else
						colorToAdd = app.colors.item(Swatchname);
			}
				
			if(col.mode.toLowerCase() == "rgb")		
			{	
					var r = parseFloat(col.c1)*255;
					var g = parseFloat(col.c2)*255;
					var b = parseFloat(col.c3)*255;
					if(app.documents.length)
						app.activeDocument.colors.add({name:Swatchname, model:swatchColorModel, space:ColorSpace.rgb,colorValue:[r,g,b]});
					else
						app.colors.add({name:Swatchname, model:swatchColorModel, space:ColorSpace.rgb,colorValue:[r,g,b]});
			}
			else  if(col.mode.toLowerCase() == "cmyk")
			{
					var c = parseFloat(col.c1)*100;
					var m = parseFloat(col.c2)*100;
					var y = parseFloat(col.c3)*100;
					var k = parseFloat(col.c4)*100;
					if(app.documents.length)
						app.activeDocument.colors.add({name:Swatchname, model:swatchColorModel, space:ColorSpace.cmyk ,colorValue:[c,m,y,k]});
					else
						app.colors.add({name:Swatchname, model:swatchColorModel, space:ColorSpace.cmyk ,colorValue:[c,m,y,k]});

			}
		   else if(col.mode.toLowerCase() ==  "lab")
			{
					var l = parseFloat(col.c1);
					var a =  parseFloat(col.c2);
					var b = parseFloat(col.c3);
					if(app.documents.length)
						app.activeDocument.colors.add({name:Swatchname, model:swatchColorModel, space:ColorSpace.lab ,colorValue:[l,a,b]});
					else
						app.colors.add({name:Swatchname, model:swatchColorModel, space:ColorSpace.lab ,colorValue:[l,a,b]});

			}
			else
			{
                    var  rgb = kulerHSV2RGB(parseFloat(col.c1),parseFloat(col.c2),parseFloat(col.c3));
                    var r = parseFloat(rgb.red) * 255;
			  var g = parseFloat(rgb.green) * 255;
			  var b = parseFloat(rgb.blue) * 255;
                    if(app.documents.length)
					app.activeDocument.colors.add({name:Swatchname, model:swatchColorModel, space:ColorSpace.rgb,colorValue:[r,g,b]});
				else
					app.colors.add({name:Swatchname, model:swatchColorModel, space:ColorSpace.rgb,colorValue:[r,g,b]});

            }
		}
			strResult += '<true/></property>';
			strResult += '<property id="strError"><string></string></property>';
		}
		else
		{
			strResult += '<false/></property>';
			strResult += '<property id="strError"><string>Not Able to Add Swatches to the panel</string></property>';
		}
	}
	catch(err)
	{
		strResult = '<object><property id="bSuccess">';
		strResult += '<false/></property>';
		strResult += '<property id="strError"><string>Not Able to Add Swatches to the panel</string></property>';
	}
	strResult += '</object>';
	return strResult;
}

var objSwatch={};
var strResultActiveColor = "";

function setActiveColor(objSwatch)
{
	strResultActiveColor = "";
									
	if( 'undefined' != typeof objSwatch && 
		'undefined' != typeof objSwatch.swatchName &&
		'undefined' != typeof objSwatch.ColorModel &&
		'undefined' != typeof objSwatch.ColorSpace &&
		'undefined' != typeof objSwatch.r &&
		'undefined' != typeof objSwatch.g && 
		'undefined' != typeof objSwatch.b
		)
	{
		var coloract;
		if(app.documents.length)
			coloract = app.activeDocument.colors.add( {name:objSwatch.swatchName ,model:objSwatch.ColorModel, space:objSwatch.ColorSpace, colorValue:[objSwatch.r,objSwatch.g,objSwatch.b]} ) ;
		else
			coloract = app.colors.add( {name:objSwatch.swatchName ,model:objSwatch.ColorModel, space:objSwatch.ColorSpace, colorValue:[objSwatch.r,objSwatch.g,objSwatch.b]} ) ;

		if(app.strokeFillProxySettings.active == StrokeFillProxyOptions.fill)
		{
			app.strokeFillProxySettings.fillColor =coloract;
			strResultActiveColor = '<true/></property>';
			strResultActiveColor += '<property id="strError"><string></string></property>';
		}
		else if(app.strokeFillProxySettings.active == StrokeFillProxyOptions.stroke)
		{
			app.strokeFillProxySettings.strokeColor = coloract;
			strResultActiveColor = '<true/></property>';
			strResultActiveColor += '<property id="strError"><string></string></property>';
		}
		else
    		{
    			strResultActiveColor = '<false/></property>';
			strResultActiveColor += '<property id="strError"><string>ActiveColorUnknownErrTxt</string></property>';
    		} 
	}
	else
    	{
    		strResultActiveColor = '<false/></property>';
		strResultActiveColor += '<property id="strError"><string>ActiveColorUnknownErrTxt</string></property>';
    	}
}


//SET ACTIVE COLOR
function kulerSetActiveColor(activeColorXML)
{
	var strResult = '<object><property id="bSuccess">';
	var isActiveColorSet = false;

	try
	{
		var xmlData = new XML(kulerParse(activeColorXML));
		if( null != xmlData && app.documents)
         	{ 
    			var r = parseFloat(xmlData.r)*255;
    		 	var g = parseFloat(xmlData.g)*255;
    		 	var b = parseFloat(xmlData.b)*255;
		
		 	var origswatchName = "R ="+Math.floor(r + 0.5) +", G ="+Math.floor(g + 0.5) +", B ="+Math.floor(b + 0.5) ;
		
		 	var iCount = 0;
			var colorToAdd;
			if(app.documents.length)
				colorToAdd = app.activeDocument.colors.item(origswatchName);
			else
				colorToAdd = app.colors.item(origswatchName);
			var swatchName = origswatchName ;
			while(('undefined' != typeof colorToAdd) && (null != colorToAdd))
			{
				++iCount;
				swatchName = origswatchName +" "+ iCount;
				if(app.documents.length)
					colorToAdd = app.activeDocument.colors.item(swatchName);
				else
					colorToAdd = app.colors.item(swatchName);
			}
		
				if(null == objSwatch || 'undefined' == typeof objSwatch){
					objSwatch = {};
				}	
				objSwatch = {
					swatchName: swatchName,
					ColorModel: ColorModel.process,
					ColorSpace: ColorSpace.rgb,
					r: r,
					g: g,
					b: b
				}

				app.doScript ("setActiveColor(objSwatch);", undefined, undefined, UndoModes.entireScript, "");
				strResult += strResultActiveColor;	
    		}
		else
		{
			strResult += '<false/></property>';
			strResult += '<property id="strError"><string>NoDocForActiveErrTxt</string></property>';
		}

	}
	catch(err)
	{
		strResult = '<object><property id="bSuccess">';
		strResult += '<false/></property>';
		strResult += '<property id="strError"><string>ActiveColorUnknownErrTxt</string></property>';
	}
	strResult += '</object>';
	return strResult;
}

///////////////////////////////////////////////////////KULER SPECIFIC FUNCTIONS///////////////////////////////////////////////////////

//parses encoded strings passed from the SWF
var kulerParse = function(fileBinary)
{
			var val = fileBinary;
			var charmark = 4;
			var retStr = new String();
			var i = 0;
			for(i=0; i<val.length; i+=4){
				var onebyte = ((val.charCodeAt(i) - 65) << 12) | ((val.charCodeAt(i+1) - 65)<<8) | ((val.charCodeAt(i+2) - 65)<<4) | (val.charCodeAt(i+3) - 65);
				var onechar = String.fromCharCode(onebyte);	
				retStr += onechar;
			}
			return retStr;
}

var encode = function(xmlString)
		{	
			var val = xmlString;
        	var retStr = new String();
            var i = 0;
            for(i=0; i<val.length; i++)
            {
        		var char1 = ((val.charCodeAt(i) & 0xf000) >> 12) + 65;
                var char2 = ((val.charCodeAt(i) & 0x0f00) >> 8) + 65;
                var char3 = ((val.charCodeAt(i) & 0x00f0) >> 4) + 65;
                var char4 = ((val.charCodeAt(i) & 0x000f)) + 65;
                
                retStr = retStr + String.fromCharCode(char1) + String.fromCharCode(char2)
                				+ String.fromCharCode(char3) + String.fromCharCode(char4);
            }
            return retStr;
}

var kulerHSV2RGB =function (h1, s1, v1)
		{
			var h = h1 * 6;
			var s = s1;
			var v = v1;
			
			var r;
			var g;
			var b;
			if (s == 0)
			{
				r = v;
				g = v;
				b = v;
			}
			else
			{
				if (h >= 6)
					h -= 6;
		
				var i = parseInt(h);
				var f = h - i;
		
				var p= v * (1 - s);
				var q = v * (1 - (s * f));
				var t = v * (1 - (s * (1 - f)));
		
				switch (i)
				{
				case 0:
					r = v;	g = t;	b = p;
					break;
		
				case 1:
					r = q;	g = v;	b = p;
					break;
		
				case 2:
					r = p;	g = v;	b = t;
					break;
		
				case 3:
					r = p;	g = q;	b = v;
					break;
		
				case 4:
					r = t;	g = p;	b = v;
					break;
		
				case 5:
					r = v;	g = p;	b = q;
					break;
				}
			}
			
			var rgb = {red:r , green:g, blue:b};
			return rgb;
		}


//Gets docuement color space of kuler
// For ID, it's always CMYK
var kulerGetDocColorSpace = function()
{
	
	var strXMLResult = '<object><property id="bSuccess">';
	try
	{
	if('undefined' != typeof app)
	{
		strXMLResult += '<true/></property>';
		strXMLResult += '<property id="strError"><string></string></property>';
		strXMLResult += '<property id="strDocColorSpace"><string>cmyk</string></property>';
	}
	else
	{
		strXMLResult += '<false/></property>';
		strXMLResult += '<property id="strError"><string>Unable to retrieve Doc Info</string></property>';
	}
	}
	catch(err)
	{
		strXMLResult = '<object><property id="bSuccess">';
		strXMLResult += '<false/></property>';
		strXMLResult += '<property id="strError"><string>Unable to retrieve Doc Info</string></property>';
	}
	strXMLResult += '</object>';
	return strXMLResult;
}
