/*
@@@BUILDINFO@@@ kuler2.jsx 3.0.0.12 16-September-2009
*/
//Point Product: PS
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

	
var kulerAddToSwatch = function(strData)
{
	var strResult = '<object><property id="bSuccess">';
	try{
		var xmlData = new XML(kulerParse(strData));
		if('undefined' != typeof xmlData)	
		{
			for(i=0;i<xmlData.theme.swatches.children().length();i++)
			{
				col = xmlData.theme.swatches.swatch[i];
				var arrColor = new Array();
			
			
			if(col.mode.toLowerCase() == "rgb")
				{
					arrColor[0] = parseFloat(col.c1) * 255;
					arrColor[1] = parseFloat(col.c2) * 255;
					arrColor[2] = parseFloat(col.c3) * 255;
					kulerAddRGBSwatches(arrColor,col.label);
				}
				else  if(col.mode.toLowerCase() == "cmyk")
			  {
					arrColor[0] = parseFloat(col.c1)*100;
					arrColor[1] = parseFloat(col.c2)*100;
					arrColor[2] = parseFloat(col.c3)*100;
					arrColor[3] = parseFloat(col.c4)*100;
					kulerAddCMYKSwatches(arrColor,col.label);
			  }
			  else if(col.mode.toLowerCase() ==  "lab")
  			{
				  arrColor[0] = parseFloat(col.c1);
				  arrColor[1] = parseFloat(col.c2);
				  arrColor[2] = parseFloat(col.c3);
				  kulerAddLABSwatches(arrColor,col.label);
  			}
  			else
  			{
			    var  rgb = kulerHSV2RGB(parseFloat(col.c1),parseFloat(col.c2),parseFloat(col.c3));
				arrColor[0] = parseFloat(rgb.red) * 255;
				arrColor[1] = parseFloat(rgb.green) * 255;
				arrColor[2] = parseFloat(rgb.blue) * 255;
				kulerAddRGBSwatches(arrColor,col.label);        
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
	
		strXMLResult += '<true/></property>';
		strXMLResult += '<property id="strError"><string></string></property>';
		strXMLResult += '<property id="strDocColorSpace"><string>rgb</string></property>';
	
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

var kulerGetFillForeColor = function()
{
	var strXMLResult = '<object><property id="bSuccess">';
	try
	{
	if('undefined' != typeof app
		&& 'undefined' != typeof app.foregroundColor)
		{
			var fgColor = new SolidColor();
			fgColor = app.foregroundColor;
			strXMLResult += '<true/></property>';
			strXMLResult += '<property id="strError"><string></string></property>';
			strXMLResult += '<property id="color"><object>';
			strXMLResult += '<property id="r"><number>' +fgColor.rgb.red/255+ '</number></property>';
			strXMLResult += '<property id="g"><number>' +fgColor.rgb.green/255+ '</number></property>';
			strXMLResult += '<property id="b"><number>' +fgColor.rgb.blue/255+ '</number></property>';
			strXMLResult += '</object></property>';
			}
	else
	{
		strXMLResult += '<false/></property>';
		strXMLResult += '<property id="strError"><string>ForegroundUnknownErrTxt</string></property>';
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
	
var kulerGetStrokeBackColor = function() 
{
	var strXMLResult = '<object><property id="bSuccess">';
	try
	{
	if('undefined' != typeof app
		&& 'undefined' != typeof app.backgroundColor)
		{
			var bgColor = new SolidColor();
			bgColor = app.backgroundColor;
			
			strXMLResult += '<true/></property>';
			strXMLResult += '<property id="strError"><string></string></property>';
			strXMLResult += '<property id="color"><object>';
			strXMLResult += '<property id="r"><number>' +bgColor.rgb.red/255+ '</number></property>';
			strXMLResult += '<property id="g"><number>' +bgColor.rgb.green/255+ '</number></property>';
			strXMLResult += '<property id="b"><number>' +bgColor.rgb.blue/255+ '</number></property>';
			strXMLResult += '</object></property>';
			}
	else
	{
		strXMLResult += '<false/></property>';
		strXMLResult += '<property id="strError"><string>ForegroundUnknownErrTxt</string></property>';
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
var kulerAddRGBSwatches = function(arrColor, strLabel)
{
	var Red = arrColor[0];
	var Green = arrColor[1];
	var Blue = arrColor[2];

	var idMk = charIDToTypeID( "Mk  " );
    var desc17 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
	var ref6 = new ActionReference();
	var idClrs = charIDToTypeID( "Clrs" );
	ref6.putClass( idClrs );
    desc17.putReference( idnull, ref6 );
	var idUsng = charIDToTypeID( "Usng" );
	var desc18 = new ActionDescriptor();
	var idNm = charIDToTypeID( "Nm  " );
	desc18.putString( idNm, strLabel );
	var idClr = charIDToTypeID( "Clr " );
	var desc19 = new ActionDescriptor();
	var idRd = charIDToTypeID( "Rd  " );
	desc19.putDouble( idRd, Red );
	var idGrn = charIDToTypeID( "Grn " );
	desc19.putDouble( idGrn, Green );
	var idBl = charIDToTypeID( "Bl  " );
    desc19.putDouble( idBl, Blue );
	var idRGBC = charIDToTypeID( "RGBC" );
	desc18.putObject( idClr, idRGBC, desc19 );
    var idClrs = charIDToTypeID( "Clrs" );
    desc17.putObject( idUsng, idClrs, desc18 );
	executeAction( idMk, desc17, DialogModes.NO );
}

var kulerAddCMYKSwatches= function(arrColor, strLabel)
{
     //extract values
     var c = arrColor[0];
	   var m = arrColor[1];
	   var y = arrColor[2];
	   var k = arrColor[3];
    
      var id11 = charIDToTypeID( "Mk  " );
      var desc3 = new ActionDescriptor();
      var id12 = charIDToTypeID( "null" );
      var ref2 = new ActionReference();
      var id13 = charIDToTypeID( "Clrs" );
      ref2.putClass( id13 );
      desc3.putReference( id12, ref2 );
      var id14 = charIDToTypeID( "Usng" );
      var desc4 = new ActionDescriptor();
      var id15 = charIDToTypeID( "Nm  " );
      desc4.putString( id15, strLabel);
      var id16 = charIDToTypeID( "Clr " );
      var desc5 = new ActionDescriptor();
      var id17 = charIDToTypeID( "Cyn " );
      desc5.putDouble( id17, c );
      var id18 = charIDToTypeID( "Mgnt" );
      desc5.putDouble( id18, m );
      var id19 = charIDToTypeID( "Ylw " );
      desc5.putDouble( id19, y );
      var id20 = charIDToTypeID( "Blck" );
      desc5.putDouble( id20, k );
      var id21 = charIDToTypeID( "CMYC" );
      desc4.putObject( id16, id21, desc5 );
      var id22 = charIDToTypeID( "Clrs" );
      desc3.putObject( id14, id22, desc4 );

      executeAction( id11, desc3, DialogModes.NO );
}

var kulerAddLABSwatches= function(arrColor, strLabel)
{
    //extract values
    var l = arrColor[0];
	  var a = arrColor[1];
	  var b = arrColor[2];
	      
    var id23 = charIDToTypeID( "Mk  " );
    var desc6 = new ActionDescriptor();
    var id24 = charIDToTypeID( "null" );
    var ref3 = new ActionReference();
    var id25 = charIDToTypeID( "Clrs" );
    ref3.putClass( id25 );
    desc6.putReference( id24, ref3 );
    var id26 = charIDToTypeID( "Usng" );
    var desc7 = new ActionDescriptor();
    var id27 = charIDToTypeID( "Nm  " );
    desc7.putString( id27, strLabel);
    var id28 = charIDToTypeID( "Clr " );
    var desc8 = new ActionDescriptor();
    var id29 = charIDToTypeID( "Lmnc" );
    desc8.putDouble( id29, l );
    var id30 = charIDToTypeID( "A   " );
    desc8.putDouble( id30, a );
    var id31 = charIDToTypeID( "B   " );
    desc8.putDouble( id31, b );
    var id32 = charIDToTypeID( "LbCl" );
    desc7.putObject( id28, id32, desc8 );
    var id33 = charIDToTypeID( "Clrs" );
    desc6.putObject( id26, id33, desc7 );
    executeAction( id23, desc6, DialogModes.NO );
}


var kulerSetActiveColor = function(strData)
{
	var strResult = '<object><property id="bSuccess">';
	try{
		var xmlData = new XML(kulerParse(strData));
		if('undefined' != typeof xmlData
			)
		{//TODO: Make Changes in this block too
			var c = new SolidColor;
			c.rgb.red = parseFloat(xmlData.r) * 255;
			c.rgb.green = parseFloat(xmlData.g) * 255;
			c.rgb.blue = parseFloat(xmlData.b) * 255;
			
			app.foregroundColor = c;
			strResult += '<true/></property>';
			strResult += '<property id="strError"><string></string></property>';
			}
		else
		{
			strResult += '<false/></property>';
			strResult += '<property id="strError"><string>Not Able to Set The Active Color</string></property>';
		}
	}
	catch(err)
	{
		strResult = '<object><property id="bSuccess">';
		strResult += '<false/></property>';
		strResult += '<property id="strError"><string>Not Able to Set The Active Color</string></property>';
	}
	strResult += '</object>';
	return strResult;
	}	
