/*
@@@BUILDINFO@@@ kuler4.jsfl 3.0.0.12 16-September-2009
*/
//Point Product: FL
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

var kulerAddToSwatch = function(strData)
{
	
	var strResult = '<object><property id="bSuccess">';
	try{
		if('undefined' != typeof fl
			&& null != fl.getDocumentDOM()
			)
		{
			var doc = fl.getDocumentDOM();
			doc.setSwatchKulerTheme("'" + strData + "'");
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
	if('undefined' != typeof fl
			&& null != fl.getDocumentDOM()
			)
	{
		strXMLResult += '<true/></property>';
		strXMLResult += '<property id="strError"><string></string></property>';
		strXMLResult += '<property id="strDocColorSpace"><string>rgb</string></property>';
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

var kulerGetFillForeColor = function()
{
	var strXMLResult = '<object><property id="bSuccess">';
	try
	{
	if('undefined' != typeof fl
		&& 'undefined' != typeof fl.fillColor)
		{
		  if(fl.isFillGradient
		|| fl.fillHasBitmap
		|| '' == fl.fillColor	)
			{
				strXMLResult += '<false/></property>';
				strXMLResult += '<property id="strError"><string>FillWrongSwatch</string></property>';	
			}
		  else
		 	{

				var color = fl.fillColor;
		  
				strXMLResult += '<true/></property>';
				strXMLResult += '<property id="strError"><string></string></property>';
				strXMLResult += '<property id="color"><object>';
				strXMLResult += '<property id="r"><number>' +parseInt(color.substring(1,3), 16)/255+ '</number></property>';
				strXMLResult += '<property id="g"><number>' +parseInt(color.substring(3,5), 16)/255+ '</number></property>';
				strXMLResult += '<property id="b"><number>' +parseInt(color.substring(5,7), 16)/255+ '</number></property>';
				strXMLResult += '</object></property>';
			}
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
		if('undefined' != typeof fl
			&& 'undefined' != typeof fl.strokeColor)
		{
			if(fl.isStrokeGradient
			|| fl.strokeHasBitmap
			|| '' == fl.strokeColor)
			{
				strXMLResult += '<false/></property>';
				strXMLResult += '<property id="strError"><string>StrokeWrongSwatch</string></property>';	
			}
		  	else
		 	{
				var color = fl.strokeColor;
				strXMLResult += '<true/></property>';
				strXMLResult += '<property id="strError"><string></string></property>';
				strXMLResult += '<property id="color"><object>';
				strXMLResult += '<property id="r"><number>' +parseInt(color.substring(1,3), 16)/255+ '</number></property>';
				strXMLResult += '<property id="g"><number>' +parseInt(color.substring(3,5), 16)/255+ '</number></property>';
				strXMLResult += '<property id="b"><number>' +parseInt(color.substring(5,7), 16)/255+ '</number></property>';
				strXMLResult += '</object></property>';
			}
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

var kulerSetActiveColor = function(strData)
{
	var strResult = '<object><property id="bSuccess">';
	try{
		var xmlData = new XML(kulerParse(strData));
		if('undefined' != typeof xmlData
			&& 'undefined' != typeof fl
			&& null != typeof fl.getDocumentDOM()
			)
		{
			var red = Math.floor(parseFloat(xmlData.r) * 255 + 0.5);
			var green = Math.floor(parseFloat(xmlData.g) * 255 + 0.5);
			var blue = Math.floor(parseFloat(xmlData.b) * 255 + 0.5);
			var strColor = red.toString(16);
			if(strColor.length < 2)
			{
			 strColor = "0" + strColor;
      }
			var color = "#" + strColor;
			strColor = green.toString(16);
			if(strColor.length < 2)
			{
			 strColor = "0" + strColor;
      }
			color = color + strColor;
			strColor = blue.toString(16);
			if(strColor.length < 2)
			{
			 strColor = "0" + strColor;
      }
			color = color + strColor;
			
			fl.setActiveColor(color);
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

