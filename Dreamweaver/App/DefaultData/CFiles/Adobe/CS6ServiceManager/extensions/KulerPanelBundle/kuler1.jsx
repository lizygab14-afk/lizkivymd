/*
@@@BUILDINFO@@@ kuler1.jsx 3.0.0.12 16-September-2009
*/
//Point Product: Ai
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
			if(r<0){r=0;}
			if(g<0){g=0;}
			if(b<0){b=0;}
			if(r>1){r=1;}
			if(g>1){g=1;}
			if(b>1){b=1;}
			
			var rgb = {red:r , green:g, blue:b};
			return rgb;
		}

var  kulerLAB2RGB = function(l,a,b)
		{
			// convert to xyz
			var l = l;
			var a = a;
			var bb = b;
			
			var y = (l+16)/116;
			var x = y + a/500;
			var z = y - bb/200;
			
			// x > 6/29 ? x^3 : 108/841 (x - 4/29)
			x = x > 0.2069 ? Math.pow(x, 3) : 0.1284*(x - 0.1379);
			y = y > 0.2069 ? Math.pow(y, 3) : 0.1284*(y - 0.1379);
			z = z > 0.2069 ? Math.pow(z, 3) : 0.1284*(z - 0.1379);
			
			// multiply by white point, 2 degree D65
			x *= 95.047/100;
			//y *= 100/100;
			z *= 108.883/100;
			
			// convert to rgb
			var r = 3.24063*x - 1.53721*y - 0.498629*z;
			var g = -0.968931*x + 1.87576*y + 0.0415175*z;
			var b = 0.0557101*x - 0.204021*y + 1.057*z;
			
			// apply gamma. 0.4167 is 1/2.4 more or less
			r = r > 0.0031308 ? 1.055*Math.pow(r,0.4167)-0.055 : 12.92*r;
			g = g > 0.0031308 ? 1.055*Math.pow(g,0.4167)-0.055 : 12.92*g;
			b = b > 0.0031308 ? 1.055*Math.pow(b,0.4167)-0.055 : 12.92*b;
			
			if(r<0){r=0;}
			if(g<0){g=0;}
			if(b<0){b=0;}
			if(r>1){r=1;}
			if(g>1){g=1;}
			if(b>1){b=1;}
			var rgb = {red:r , green:g, blue:b};
			return rgb;
		}


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
		  
var kulerEncodeSwatchNames = function(strName)
{
	var strResult = strName;
	strResult = strResult.replace(/%/g, "%25");
	strResult = strResult.replace(/~/g, "%7E");
	strResult = strResult.replace(/`/g, "%60");
	strResult = strResult.replace(/@/g, "%40");
	strResult = strResult.replace(/#/g, "%23");
	strResult = strResult.replace(/\$/g, "%24");
	strResult = strResult.replace(/\^/g, "%5E");
	strResult = strResult.replace(/&/g, "%26");
	strResult = strResult.replace(/\+/g, "%2B");
	strResult = strResult.replace(/\=/g, "%3D");
	strResult = strResult.replace(/{/g, "%7B");
	strResult = strResult.replace(/}/g, "%7D");
	strResult = strResult.replace(/\[/g, "%5B");
	strResult = strResult.replace(/\]/g, "%5D");
	strResult = strResult.replace(/\|/g, "%7C");
	strResult = strResult.replace(/\\/g, "%5C");
	strResult = strResult.replace(/;/g, "%3B");
	strResult = strResult.replace(/:/g, "%3A");
	strResult = strResult.replace(/\"/g, "%22");
	strResult = strResult.replace(/</g, "%3C");
	strResult = strResult.replace(/>/g, "%3E");
	strResult = strResult.replace(/,/g, "%2C");
	strResult = strResult.replace(/\?/g, "%3F");
	strResult = strResult.replace(/\//g, "%2F");
	strResult = strResult.replace(/\s/g,"%20");
	//The final replacing of all Non- A-Z, a-z, 0-9, the above chars (which are basically nothing but in range of A-Z, a-z, 0-9, %) , %, !, *, (, ), -, _, ' , .
	strResult = strResult.replace(/[^A-Za-z0-9%!*()-_'.]/g, "_");
	return strResult.substr (0, strResult.length-1)
}
var kulerGetAppInfo = function()
{
	var strXMLResult = '<object><property id="bSuccess">';
	try{
		if('undefined' != app 
			&& 'undefined' != typeof app.name 
			&& 'undefined' != typeof app.locale 
			&& 'undefined' != typeof app.version)
		{
			var strVersion = app.version;
			iFirst = strVersion.indexOf ('.', 0);
			iSecond = strVersion.indexOf ('.', iFirst+1);
			var strMajVer = strVersion.substring (0, iFirst);
			var strMinVer = strVersion.substring (iFirst+1, iSecond);
			strXMLResult += '<true/></property>';
			strXMLResult += '<property id="strError"><string></string></property>';
			strXMLResult += '<property id="strAppName"><string>' + app.name + '</string></property>';
			strXMLResult += '<property id="strAppMajVersion"><string>' + strMajVer + '</string></property>';		
			strXMLResult += '<property id="strAppMinVersion"><string>' + strMinVer + '</string></property>';
			strXMLResult += '<property id="strAppLocale"><string>' + app.locale + '</string></property>';
		}
		else
		{
			strXMLResult += '<false/></property>';
			strXMLResult += '<property id="strError"><string>Unable to retrieve App Info</string></property>';
		}
	}
	catch(err)
	{
		strXMLResult = '<object><property id="bSuccess">';
		strXMLResult += '<false/></property>';
		strXMLResult += '<property id="strError"><string>Unable to retrieve App Info</string></property>';
	}
	strXMLResult += '</object>';
	return strXMLResult;
}

var kulerCreateColorObjectString = function(iIndex, strMode, strLabel, strAttribute, nC1, nC2, nC3, nC4)
{
	var strXMLResult = "";
	strXMLResult += '<property id="' + iIndex + '"><object>';
	strXMLResult += '<property id="mode"><string>' + strMode + '</string></property>';
	strXMLResult += '<property id="label"><string>' + strLabel + '</string></property>';
	strXMLResult += '<property id="attribute"><string>' + strAttribute + '</string></property>'
	strXMLResult += '<property id="c1"><number>' + nC1 + '</number></property>';
	strXMLResult += '<property id="c2"><number>' + nC2 + '</number></property>';
	strXMLResult += '<property id="c3"><number>' + nC3 + '</number></property>';
	strXMLResult += '<property id="c4"><number>' + nC4 + '</number></property>';
	strXMLResult += '</object></property>';
	return strXMLResult;					
}

var kulerGetSelectedSwatches = function()
{
	var strXMLResult = '<object><property id="bSuccess">';
		var bGotValidSwatch = false;
		var j = 0;
		var i = 0;
		var regExpName = /[^a-zA-Z0-9_\s]/g; //For [ ^a-zA-Z0-9_ ]
	try
	{
		if('undefined' != typeof app
		&& 'undefined' != typeof app.documents
		&& 0 != app.documents.length
		&& 'undefined' != typeof app.documents[0] )
		{
			if('undefined' != typeof app.documents[0].swatches
			&& 'undefined' != typeof app.documents[0].swatches.getSelected()
			)
			{
				strXMLResult += '<true/></property>';
				strXMLResult += '<property id="strError"><string></string></property>';
				strXMLResult += '<property id="Swatches"><array>';
				var arrSelectedSwatches = app.documents[0].swatches.getSelected();
				if('undefined' != typeof arrSelectedSwatches
				&& 0 < arrSelectedSwatches.length)
				{
					for(i=0;i<arrSelectedSwatches.length;i++)
					{
						var strName = kulerEncodeSwatchNames(arrSelectedSwatches[i].name);
						if(arrSelectedSwatches[i].color.typename.toLowerCase() == "rgbcolor")
						{
							strXMLResult += kulerCreateColorObjectString(j, 'rgb', strName, 'localProcess', arrSelectedSwatches[i].color.red, 
																							arrSelectedSwatches[i].color.green, arrSelectedSwatches[i].color.blue, 0.0);
							j++;
							bGotValidSwatch = true;
						}
						else if(arrSelectedSwatches[i].color.typename.toLowerCase() == "cmykcolor")
						{
							strXMLResult += kulerCreateColorObjectString(j, 'cmyk', strName, 'localProcess', arrSelectedSwatches[i].color.cyan,
																							arrSelectedSwatches[i].color.magenta, arrSelectedSwatches[i].color.yellow, arrSelectedSwatches[i].color.black);
							j++;
							bGotValidSwatch = true;
						}
						else if(arrSelectedSwatches[i].color.typename.toLowerCase() == "spotcolor")
						{
							var SelectedSpot = arrSelectedSwatches[i].color.spot;
//var SpotColor = SelectedSpot.color;
							if(SelectedSpot.colorType == ColorModel.PROCESS || SelectedSpot.colorType == ColorModel.REGISTRATION)//for process or registration
							{
								if(SelectedSpot.spotKind == SpotColorKind.SPOTRGB)//RGB
								{
									var ColorValues = SelectedSpot.getInternalColor();
									
									strXMLResult += kulerCreateColorObjectString(j, 'rgb', strName, 'globalProcess', ColorValues[0],
																						ColorValues[1], ColorValues[2], 0.0);
									j++;
									bGotValidSwatch = true;
								}
								else if(SelectedSpot.spotKind == SpotColorKind.SPOTCMYK)//CMYK
								{	
									var ColorValues = SelectedSpot.getInternalColor();
									strXMLResult += kulerCreateColorObjectString(j, 'cmyk', strName, 'globalProcess', ColorValues[0],
																							ColorValues[1], ColorValues[2], ColorValues[3]);
									j++;
									bGotValidSwatch = true;
								}
								else if(SelectedSpot.spotKind == SpotColorKind.SPOTLAB)//LAB
								{
									var ColorValues = SelectedSpot.getInternalColor();									
									strXMLResult += kulerCreateColorObjectString(j, 'lab', strName, 'globalProcess', ColorValues[0],
																							ColorValues[1], ColorValues[2], 0.0);
									j++;
									bGotValidSwatch = true;
								}
								else//error code*
								{
								}
							}
							else if(SelectedSpot.colorType == ColorModel.SPOT)//for Spot
							{
								if(SelectedSpot.spotKind == SpotColorKind.SPOTRGB)//RGB
								{
									var ColorValues = SelectedSpot.getInternalColor();
									
									strXMLResult += kulerCreateColorObjectString(j, 'rgb', strName, 'spot', ColorValues[0],
																						ColorValues[1], ColorValues[2], 0.0);
									j++;
									bGotValidSwatch = true;
								}
								else if(SelectedSpot.spotKind == SpotColorKind.SPOTCMYK)//CMYK
								{
									var ColorValues = SelectedSpot.getInternalColor();
									strXMLResult += kulerCreateColorObjectString(j, 'cmyk', strName, 'spot', ColorValues[0],
																							ColorValues[1], ColorValues[2], ColorValues[3]);
									j++;
									bGotValidSwatch = true;
								}
								else if(SelectedSpot.spotKind == SpotColorKind.SPOTLAB)//LAB
								{
									

									var ColorValues = SelectedSpot.getInternalColor();									
									strXMLResult += kulerCreateColorObjectString(j, 'lab', strName, 'spot', ColorValues[0],
																							ColorValues[1], ColorValues[2], 0.0);
									j++;
									bGotValidSwatch = true;
								}
								else//error code*
								{
								}
							}
							else//error code*
							{
							}
						}
						else
						{
							//*CODE ERROR
							//error: for other kind of swatches like Gradient, None etc........
							//Nothing to do here just check at the end for the bGotValidSwatch variable and according send the error or just the builded Up String
						}
					}
					if(bGotValidSwatch == false && i > 0)
					{
						strXMLResult = '<object><property id="bSuccess">';
						strXMLResult += '<false/></property>';
						strXMLResult += '<property id="strError"><string>strInvalidSwatchErr';
						strXMLResult += '</string></property>';
						//throw 'strInvalidSwatchErr';
					}
					else
					{
						strXMLResult += '</array></property>';
					}
				}
				else
				{
					strXMLResult = '<object><property id="bSuccess">';
					strXMLResult += '<false/></property>';
					strXMLResult += '<property id="strError"><string>NoSwatchSelected';
					strXMLResult += '</string></property>';
					//throw 'uploadThemeErrAlertTxt';//TODO need to change this after confirmation from SCOTT
				}
			}
			else
			{
				strXMLResult += '<false/></property>';
				strXMLResult += '<property id="strError"><string>Error</string></property>';
			}	
		}
		else
		{
			strXMLResult = '<object><property id="bSuccess">';
			strXMLResult += '<false/></property>';
			strXMLResult += '<property id="strError"><string>NoDocOpenUpload';
			strXMLResult += '</string></property>';
		}
	}
	catch(err)
	{
		strXMLResult = '<object><property id="bSuccess">';
		strXMLResult += '<false/></property>';
		strXMLResult += '<property id="strError"><string>';
		if( err.toString() == 'strInvalidSwatchErr' || err.toString() == 'uploadThemeErrAlertTxt' || err.toString() == 'NoDocOpenUpload')//chnage upload to something else after SCOTT's confirmation
		{
			strXMLResult += err.toString();
		}
		else
		{
			strXMLResult += 'Error';
		}
		strXMLResult += '</string></property>';
	}
	strXMLResult += '</object>';
	return strXMLResult;
}

var kulerAddToSwatch = function(strData)
{
	
	var strResult = '<object><property id="bSuccess">';
	try{
		var xmlData = new XML(kulerParse(strData));
		if('undefined' != typeof xmlData
			&& 'undefined' != typeof app
			&& 'undefined' != typeof app.documents
			&& 0 != app.documents.length
			&& 'undefined' != typeof app.documents[0])
		{
			var doc = app.documents[0];
			var docSwatches = doc.swatches;
			var docSwatchGroups = doc.swatchGroups;
			var newSwatchGrp = docSwatchGroups.add();
			var strGrpName = xmlData.theme.label.toString();
			strGrpName = strGrpName.replace ("&", "and");
			newSwatchGrp.name = strGrpName;
			for(i=0;i<xmlData.theme.swatches.children().length();i++)
			{
				col = xmlData.theme.swatches.swatch[i];
				
				//Creating the Appropriate Name
				var spotColorName = col.label;
				var swatchColorName = col.label;
				var iCount = 0;
        
				while(1){
					try{
						doc.spots.getByName(spotColorName);
					}
					catch(e)
					{
						break;
					}
					iCount++;
					spotColorName = col.label + iCount.toString();
				}
        
				iCount = 0;
        
				while(1)
				{
					try{
						doc.swatches.getByName(swatchColorName);
					}
					catch(e)
					{
						break;
					}
					iCount++;
					swatchColorName = col.label + iCount.toString();
				}
        
				
				var newColor;
				if(col.mode.toLowerCase() == "rgb")//creating the color
				{
				    newColor = new RGBColor();
					newColor.red = parseFloat(col.c1) * 255;
					newColor.green = parseFloat(col.c2) * 255;
					newColor.blue = parseFloat(col.c3) * 255;
				}
				else if(col.mode.toLowerCase() == "cmyk")
				{
					newColor = new CMYKColor();
					newColor.cyan = parseFloat(col.c1) * 100;
					newColor.magenta = parseFloat(col.c2) * 100;
					newColor.yellow = parseFloat(col.c3) * 100;
					newColor.black = parseFloat(col.c4)*100;
				}
				else if(col.mode.toLowerCase() ==  "lab")
				{
				  
					if(col.attribute.toLowerCase() != "spot")
					{
          		var rgb = kulerLAB2RGB(parseFloat(col.c1), parseFloat(col.c2), parseFloat(col.c3));
              newColor = new RGBColor();
							newColor.red = parseFloat(rgb.red) * 255;
							newColor.green = parseFloat(rgb.green) * 255;
							newColor.blue = parseFloat(rgb.blue) * 255;
          }
					else
					{
							newColor = new LabColor();
							newColor.l = parseFloat(col.c1);
							newColor.a = parseFloat(col.c2);
							newColor.b = parseFloat(col.c3);
					}
				}
				else if(col.mode.toLowerCase() == "hsv")
				{
					var  rgb = kulerHSV2RGB (col.c1, col.c2, col.c3);
					newColor = new RGBColor();
					newColor.red = parseFloat(rgb.red) * 255;
					newColor.green = parseFloat(rgb.green) * 255;
					newColor.blue = parseFloat(rgb.blue) * 255;
				}
				else
				{
						throw 'err';
				}
				
				if(col.attribute.toLowerCase() == "localprocess")
				{
					var newSwatch = docSwatches.add();
					newSwatch.name = swatchColorName;
					newSwatch.color = newColor;
					newSwatchGrp.addSwatch(newSwatch);
				}
				else if(col.attribute.toLowerCase() == "globalprocess")
				{
					var newSpot = doc.spots.add();
					newSpot.name = spotColorName;
					newSpot.colorType = ColorModel.PROCESS;
					newSpot.color = newColor;
					newSwatchGrp.addSpot(newSpot);
				}
				else if(col.attribute.toLowerCase() == "spot")
				{
					var newSpot = doc.spots.add();
					newSpot.name = spotColorName;
					newSpot.colorType = ColorModel.SPOT;
					newSpot.color = newColor;
					newSwatchGrp.addSpot(newSpot);
				}
				else
				{
					throw 'err';
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

var kulerGetDocColorSpace = function()
{
	
	var strXMLResult = '<object><property id="bSuccess">';
	try
	{
	if('undefined' != typeof app
		&& 'undefined' != typeof app.documents
		&& 0 != app.documents.length
		&& 'undefined' != typeof app.documents[0]
		&& 'undefined' != typeof app.documents[0].documentColorSpace)
	{
		strXMLResult += '<true/></property>';
		strXMLResult += '<property id="strError"><string></string></property>';
		strXMLResult += '<property id="strDocColorSpace"><string>' + app.documents[0].documentColorSpace + '</string></property>';
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
