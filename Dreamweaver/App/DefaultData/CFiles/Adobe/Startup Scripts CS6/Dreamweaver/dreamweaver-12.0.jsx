//alert("Version from 01/09/06");

/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2006 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and may be covered by U.S. and Foreign Patents,
* patents in process, and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

/*
@@@START_XML@@@
<?xml version="1.0" encoding="UTF-8"?>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="en_US">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>This script enables other applications to communicate with Adobe Dreamweaver.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="fr_FR">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>Ce script permet à d'autres applications de communiquer avec Adobe Dreamweaver.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ja_JP">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>このスクリプトは、他のアプリケーションと Adobe Dreamweaver との通信を有効にします。</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="de_DE">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>Mithilfe dieses Skripts können andere Anwendungen mit Adobe Dreamweaver kommunizieren.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="it_IT">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>Questo script consente ad altre applicazioni di comunicare con Adobe Dreamweaver</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="es_ES">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>Este script posibilita que otras aplicaciones se comuniquen con Adobe Dreamweaver</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="nl_NL">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>Dit script laat andere toepassingen toe te communiceren met Adobe Dreamweaver</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="pt_BR">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>Este script permite que outros aplicativos se comuniquem com o Adobe Dreamweaver</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="nb_NO">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>Skriptet gjør at andre programmer kan kommunisere med Adobe Dreamweaver</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="da_DK">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>Dette script betyder, at andre programmer kan kommunikere med Adobe Dreamweaver</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="fi_FI">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>Tämän komentosarjan avulla muut sovellukset ja Adobe Dreamweaver voivat kommunikoida keskenään</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="sv_SE">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>Det här skriptet gör det möjligt för andra program att kommunicera med Adobe Dreamweaver</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="zh_TW">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>此指令碼能讓其他應用程式與 Adobe Dreamweaver 進行通訊。</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="zh_CN">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>此脚本使其它应用程序能够与 Adobe Dreamweaver 进行通信</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ko_KR">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>이 스크립트를 사용하면 다른 응용 프로그램에서 Adobe Dreamweaver 과(와) 통신할 수 있습니다.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="cs_CZ">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>Díky tomuto skriptu mohou ostatní aplikace komunikovat s aplikací Adobe Dreamweaver.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="pl_PL">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>Ten skrypt umożliwia innym aplikacjom komunikowanie się z programem Adobe Dreamweaver.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ru_RU">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>Этот сценарий позволяет другим приложениям обмениваться данными с Adobe Dreamweaver.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="tr_TR">
     <dc:title>Adobe Dreamweaver CS6</dc:title>
     <dc:description>Bu komut dosyası, diğer uygulamaların Adobe Dreamweaver ile iletişim kurmasına olanak sağlar.</dc:description>
</ScriptInfo>
@@@END_XML@@@
*/

//--------------------------------------------------------------------
// DREAMWEAWER COMMON INTERFACE
//--------------------------------------------------------------------


var Dreamweaver = new Object();
var dreamweaver = Dreamweaver;	// Also support
var dw = Dreamweaver;			// Also support

$.localize = true;

//---------------------------------------------------------
// executeScript ()
//	Lets DW execute the specified JavaScript. 
//	The entire document object model (DOM) of the target application is available to the script.
//
dw.executeScript = function ( script )
{
	var bt = new BridgeTalk;

	bt.target = 'dreamweaver';
	bt.body = script;
	bt.send();
}

//---------------------------------------------------------
// quit()
//	Performs the equivalent of DW's File > Exit or File > Quit command.
//
dw.quit = function ()
{
	if (BridgeTalk.isRunning('dreamweaver')) // First check if Dreamweaver is open 
	{
		dw.executeScript("dw.quitApplication();");
	}
}

//---------------------------------------------------------
// openAsNew(fromTemplate)
//	Performs the equivalent of DW‚Äôs File > New command.
//
//	Arguments
//	- fromTemplate:	If true DW prompts for a template to use, if false the default "New Document"-dialog is used.
//
dw.openAsNew = function ( fromTemplate )
{
	dw.activate();
	
	if ((fromTemplate != undefined) && fromTemplate)
		dw.executeScript("dw.newFromTemplate()");
	else
		dw.executeScript("dw.newDocument()");
}

//---------------------------------------------------------
// open(files)
//	Performs the equivalent of DW‚Äôs File > Open command on the specified files.
//
//	Arguments
//	- files:	A File object or array of File objects. (See File and Folder Objects.)
//
dw.open = function open( files )
{
	if (files.reflect.name == "Array")
	{
		dw.activate();
	
		for (var index=0; index < files.length; index++)
		{
			var script = "dw.openDocument(dw.convertURIToFilePath('" + files[index].fsName + "'));"
			dw.executeScript(script);
		}
	}
	else if (files.reflect.name == "File")
	{
		dw.activate();

		var script = "dw.openDocument(dw.convertURIToFilePath('" + files.fsName + "'));"
		dw.executeScript(script);
	}
}

//---------------------------------------------------------
// print(files)
//	Performs the equivalent of DW's File > PrintCode command on the requested files.
//
//	Arguments
//	- files:	A File object or array of File objects. (See File and Folder Objects.)
//
dw.print = function ( files )
{
	if (files.reflect.name == "Array")
	{
		dw.activate();
	
		for (var index=0; index < files.length; index++)
		{
			var script = "dw.printDocument(dw.convertURIToFilePath('" + files[index].fsName + "'));"
			dw.executeScript(script);
		}
	}
	else if (files.reflect.name == "File")
	{
		dw.activate();

		var script = "dw.printDocument(dw.convertURIToFilePath('" + files.fsName + "'));"
		dw.executeScript(script);
	}
}

//---------------------------------------------------------
// reveal(file)
//	Gives DW the operating-system focus, and, if the specified file is open in DW, brings it to the foreground.
//
//	Arguments
//	- files:	A File object or string specifying a file that can be opened in the target application.
//
dw.reveal = function ( file )
{
	if (file.reflect.name == "File")
	{
		dw.activate();

		var script = "dw.revealDocument(dw.convertURIToFilePath('" + file.fsName + "'));"
		dw.executeScript(script);
	}
	else if (file.reflect.name == "String")
	{
		dw.activate();

		var script = "dw.revealDocument(dw.convertURIToFilePath('" + file + "'));"
		dw.executeScript(script);
	}
}



//---------------------------------------------------------
// place -  insert files into active document or site
//
// Description: Place attempts to insert the specified files
//	into the current page. If no page is open nothing will happen.
dw.place = function ( files )
{
	dw.executeScript(
					"var doc = dw.getDocumentDOM();" +
					"if (doc != null)" +
						"doc.insertFiles(" + files + ");"
					);
	dw.activate();
}

//--------------------------------------------------------------------
// BRIDGE UI
//--------------------------------------------------------------------


//---------------------------------------------------------
// Create Bridge Specific UI
//
if( BridgeTalk.appName == 'bridge' )
{
	var placeInDreamweaverMenu = MenuElement.create( 'command', 
		localize ("$$$/DWBI/Menu/Place/InDreamweaver=In Dreamweaver"), 
		'at the end of submenu/Place', 'PlaceInDreamweaver' );
	
	placeInDreamweaverMenu.onSelect = function()
	{
		// Get all selected files (no containers).
		var sel = app.document.getSelection("*");
		
		// Get the files, may be remote/version cue
//		app.preflightFiles( sel );	// deprecated, use app.acquirePhysicalFiles() instead:

		app.acquirePhysicalFiles( sel );
		var fileList = Dreamweaver.thumbnailsToFiles(sel);

		dw.place(fileList);
	}
   
	placeInDreamweaverMenu.onDisplay = function()
	{
		this.enabled = false;

		if (app.document.selectionLength > 0)
		{
			// You can put at least a link to anything onto a HTML-page
			// If there was filtering, this is where it would go

			// For performace reasons, we should not get a selection with too many objects for every click in the menu bar.
			// So if the selection is higher than 200, we optimistically assume that there will be at least one non-container object in the list
			// and then handle the filtering only if the menu item is actually selected.
			if (app.document.selectionLength > 200)
			{
				this.enabled = true;
			}
			else
			{
				// Get all selected files (no containers).
				var sel = app.document.getSelection("*");
				
				if (sel.length > 0)
					this.enabled = true;
			}
		}
	}
} // End of Bridge specific code


//--------------------------------------------------------------------
// UTILITIES
//--------------------------------------------------------------------

//---------------------------------------------------------
// activate()
//	Gives DW the operating-system focus.
//
dw.activate = function ()
{
	dw.executeScript("dw.activateApplication();");
	BridgeTalk.bringToFront('dreamweaver');
}

//---------------------------------------------------------
// argsToString -  
//
// Description:
//	This routine create a string for the arguments that we can transmit
//	over BridgeTalk as text.
//

Dreamweaver.argsToString = function ( args )
{
	var outArgs = new Array();
	
	for( var index=0; index<args.length; index++ )
	{
		outArgs.push(args[index].toSource());
	}
		
	return outArgs.join(',');
}


//---------------------------------------------------------
// thumbnailsToFiles -  
//
// Description:
//	Convert a bridge thumbnails list to file references.
//

Dreamweaver.thumbnailsToFiles = function ( thumbList )
{
	var outFileList = new Array();
	
	for( var index=0; index<thumbList.length; index++ )
	{
		if (thumbList[index].spec != undefined) // Filter out containers (volumes and folders)
			outFileList.push('"'+thumbList[index].spec.fsName+'"');
	}
		
	return outFileList.join(',');
}
