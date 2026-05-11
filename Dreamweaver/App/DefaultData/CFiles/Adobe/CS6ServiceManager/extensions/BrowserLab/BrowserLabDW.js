var _gMeerMeerDWService = "BL";
var _gSMExtension = "SME";
var _jsMeerMeerDebugFile = "C:\\meermeer_js_debug.txt";

//show local files warning dialog before uploading local files
var _gShowLocalFilesWarningDialogPreference = "SHOW_LOCAL_FILES_WARNING_DIALOG";
var _gLocalFilesUploadPreference = "ALLOW_LOCAL_FILES_PUBLISH_TO_SERVICE";

//error codes for uploading to testing server
var IDS_FILE_IN_MULTIPLE_SITES = 7068;
var IDS_SITE_NOSITEFORFILE = 7179;
var _currentPreviewSession = null;
var _bMarkForGC = false;//mark for GC.
var _gbEscapeBackSlash = true //fix for single quote with double blackslash

//remote server peer class
var _dwRemoteServerPeer = null;
//local file peer class
var _dwLocalFilePeer = null;

//location of permission store
var PERMISSION_STORE_FILE = dw.getUserConfigurationPath() + '/Commands/BL_PermissionSettings.json';
var _allowLocalContentPrefKey = "ALLOW_LOCAL_PREVIEW";


//get the application locale...since CSXS Host Env has licensedLanguage locale which is different from appLanguage.
//(e.g. en_US or en_GB)
function getAppLanguage()
{
    var appLocaleRetVal =  '<object>';
    appLocaleRetVal += '<property id="appLocale"><string><![CDATA[' + dw.getAppLanguage() + ']]></string></property>';      
    appLocaleRetVal += '<property id="status"><' + true + '/></property>';
    appLocaleRetVal += '</object>';
    return appLocaleRetVal; 
}

function initializeScript()
{
    //hide & show the meermeer panel to register the document edit handler
    dw.flash.requestStateChange(_gMeerMeerDWService, "Hide");
    dw.flash.requestStateChange(_gMeerMeerDWService, "Show");
    //DWfile.write(_jsMeerMeerDebugFile, "Meer Meer JS Debug");
    
    //initialize our classes
    _dwRemoteServerPeer = new DWRemoteServerJSPeer();
    _dwLocalFilePeer = new DWLocalFileJSPeer(); 

    //check if preview is pending
	var bHasPendingRequest = false;
	
    var initialPreviewObject = MM._BrowserLab_Init_Preview_Object;
    if (initialPreviewObject != null)
	{
		bHasPendingRequest = true;
	}

	//form the return value , returning the pending request
    var retVal = '<object>';
    retVal += '<property id="status"><' + bHasPendingRequest + '/></property>';                  
    retVal += '</object>';  
    return retVal;  
}

function checkForPendingQueuedPreviewRequest()
{
    //see if there is pending request queued from initial launch of panel
	var bRetStatus = false;
    var initialPreviewObject = MM._BrowserLab_Init_Preview_Object;
	previewDocArgs =  '<object>';    
	if (initialPreviewObject != null)
    {
		//form the pending preview request
		previewDocArgs += '<property id="localFileURI"><string><![CDATA[' + initialPreviewObject.localFileURI + ']]></string></property>';        
		previewDocArgs += '<property id="previewURI"><string><![CDATA[' + initialPreviewObject.previewURI + ']]></string></property>';
		previewDocArgs += '<property id="isRemoteOnly"><string><![CDATA[' + initialPreviewObject.isRemoteOnly + ']]></string></property>';

		//if we have pending request queued
		bRetStatus = true; 
 
	    //clear the first request
        MM._BrowserLab_Init_Preview_Object = null;
    }
	previewDocArgs += '<property id="status"><' + bRetStatus + '/></property>';
	previewDocArgs += '</object>';  
	return previewDocArgs;
}


function documentEdited()
{    
    var currentDocument = dw.getDocumentDOM();
    if (currentDocument)
    {
        var curDocURI = currentDocument.URL;
        var bIsFrameDoc = currentDocument.isDocumentInFrame();
        var relatedDoc = null;        
		//get the active related file
        var relatedFilePath = dw.getActiveRelatedFilePath();        
        if (relatedFilePath.length || bIsFrameDoc)
        {
            currentDocument = dw.getActiveWindow();
            curDocURI = currentDocument.URL;            
        }   
        //is previewing the same file in web service
        var isPreviewingFileString = '<invoke name="isPreviewingFile" returntype="xml"><arguments><string><![CDATA[' + curDocURI + ']]></string></arguments></invoke>';
        var isPreviewingFile = dw.flash.controlEvent(_gMeerMeerDWService, isPreviewingFileString);      
        var bIsPreviewing = (isPreviewingFile == "<true/>");        
        if (bIsPreviewing)
        {
            //is file already marked dirty //then skip checks.
            var isDirtyFileString = '<invoke name="isDirtyFile" returntype="xml"><arguments><string><![CDATA[' + curDocURI + ']]></string></arguments></invoke>';
            var isDirtyFile = dw.flash.controlEvent(_gMeerMeerDWService, isDirtyFileString);        
            var bIsFileAlreadyMarkedDirty = (isDirtyFile == "<true/>");                             
                                  
            if (!bIsFileAlreadyMarkedDirty)
            {
                //send the dirty notification - if source code differ
                var onDocEditedNotifyString = '<invoke name="onDocEdited" returntype="xml"><arguments><string><![CDATA[' + curDocURI + ']]></string></arguments></invoke>';
                dw.flash.controlEvent(_gMeerMeerDWService, onDocEditedNotifyString);
            }
        }
    }
}


//called from ActionScript class.
function publishDocTestingServer(paramArgsAsString)
{
    var paramArray = decodeParamString(paramArgsAsString);
    
    var localFileURI = "";
    var previewURI = "";
    
    clearGC(); //clear GC if needed.    
    
    if (paramArray && paramArray.length == 2)
    {
        localFileURI = paramArray[0];
        previewURI = paramArray[1];     
    }   
    if (localFileURI == "null") //for null string
    {
        //empty local file uri
        localFileURI = "";
    }
    
    var retObject = _dwRemoteServerPeer.publishDoc(localFileURI, previewURI);
    
    //form the return value
    var retVal = '<object>';
    retVal += '<property id="status"><' + retObject.bUploadStatus + '/></property>';                    
    retVal += '<property id="cancelled"><' + retObject.bCancelled + '/></property>';                    
    retVal += '</object>';  
    return retVal;  
}

//called from ActionScript class.
function completedPreview() 
{
    //at some point we can bring the app (browser client) into focus here form the return value

	//flush temporary permission granted for the last preview.		
	//_dwLocalFilePeer.reloadPermissionStore(true);
	
    var bRet = true;
    var retVal = '<object>';
    retVal += '<property id="status"><' + bRet + '/></property>';                   
    retVal += '</object>';  
    return retVal;  
}

//called from ActionScript class.
function signInCSXS()
{
    var aServiceExtension = null;   
    var housingPlugIn = MM.CSXS.GetHousingPlugIn(); 
    var bSMECreated = dw.flash.controlExists(_gSMExtension);
    if (!bSMECreated)
    {
        //create/load the adobe meermeer swf/js
        aServiceExtension = housingPlugIn.findExtension(_gSMExtension);
        aServiceExtension.loadExtension();              
    }
    else
    {
        //show the extension
        aServiceExtension = housingPlugIn.findExtension(_gSMExtension);
        aServiceExtension.showExtension();          
    }   
}


function getPreviewDoc(previewMode)
{
    var bRetStatus = true; //default is true.
    var aDocURI = null;
    var aPreviewURI = null;
    
    clearGC(); //clear GC if needed.        
    
    //active document preview
    var currentDocument = _dwLocalFilePeer.getMainDoc();
    if (currentDocument)
    {
        bRetStatus = _dwLocalFilePeer.checkDocPreConditions(currentDocument, previewMode);  
        if (bRetStatus)
        {
            aDocURI = currentDocument.URL;                                          
            aPreviewURI = _dwLocalFilePeer.getPreviewURI(aDocURI);       
			aPreviewURI =  dw.doURLEncoding(aPreviewURI, "", true, true);
        }
    }
    
    //form the args XML format
    previewDocArgs =  '<object>';
    previewDocArgs += '<property id="localFileURI"><string><![CDATA[' + aDocURI + ']]></string></property>';        
    previewDocArgs += '<property id="previewURI"><string><![CDATA[' + aPreviewURI + ']]></string></property>';
    previewDocArgs += '<property id="status"><' + bRetStatus + '/></property>';
    previewDocArgs += '</object>';  
    return previewDocArgs;
}

//encode the tag markup characters
function minDWEntityEncode(origStr)
{
    var retStr = origStr; 
    retStr = retStr.replace( RegExp("<", "g"), "&dwlt;"); 
    retStr = retStr.replace( RegExp(">", "g"), "&dwgt;");   
    if (_gbEscapeBackSlash)
    {       
        //escape the back slash character.
        var aRegExp = /\\/ig;
        retStr = retStr.replace(aRegExp, "&dwbackslash;");      
    }
    return retStr;
}

function decodeParamString(paramArgsAsString)
{
	//fix any single quote encoding character	
	paramArgsAsString = paramArgsAsString.replace(RegExp("&apos;", "g"), "'");
    var paramArray = paramArgsAsString.split(",");
    return paramArray;
}


function getLocalFileContent(localFileURI)
{
    var bRetStatus = true;
    var siteRelativeURI = "";
    var siteRelativeDisplayURI = "";
    var docSource = "";
    var bIsPausedLiveCode = false;
    var docContentType = "";
    var docCharSet = "";
	var siteName = "";
    
    if (localFileURI == "null") //for null string
    {
        //empty local file uri
        localFileURI = "";
    }
    else
    {
    	localFileURI = localFileURI.replace(RegExp("&apos;", "g"), "'");    	
    }
    var bIsFileURI = (localFileURI && localFileURI.length);
        
    var retObject = _dwLocalFilePeer.getLocalDocSource(localFileURI);   
    bRetStatus = retObject.bRetStatus;  
    if (retObject.bRetStatus)
    {
        bIsPausedLiveCode = retObject.bIsPausedLiveCode;
        docSource = retObject.docSource;        
        docContentType = retObject.docContentType;
        docCharSet = retObject.docCharSet;
        if (bIsFileURI)
        {						
			//do url encoding
			siteRelativeURI = _dwLocalFilePeer.toSiteRelativeURI(retObject.currentDocument, localFileURI);
	        siteRelativeDisplayURI = siteRelativeURI; //without encoding for display purpose
            siteRelativeURI = dw.doURLEncoding(siteRelativeURI, "", true, true);                        
			siteName = site.getSiteForURL(localFileURI);
			siteName = dw.doURLEncoding(siteName, "", true, true);
        }       
    }   

	//dump the doc source if debug is on
	//DWfile.write(_jsMeerMeerDebugFile, docSource, "append");   	
                
    //form the return value
    var retVal = '<object>';
    retVal += '<property id="status"><' + bRetStatus + '/></property>';
    retVal += '<property id="paused"><' + bIsPausedLiveCode + '/></property>';          
    retVal += '<property id="docCharSet"><string><![CDATA[' + docCharSet + ']]></string></property>';
    retVal += '<property id="docSource"><string><![CDATA[' + minDWEntityEncode(docSource) + ']]></string></property>';
    retVal += '<property id="docContentType"><string><![CDATA[' + docContentType + ']]></string></property>';
    retVal += '<property id="siteRelativeURI"><string><![CDATA[' + siteRelativeURI + ']]></string></property>';     
    retVal += '<property id="siteRelativeDisplayURI"><string><![CDATA[' + siteRelativeDisplayURI + ']]></string></property>'; 
	retVal += '<property id="siteName"><string><![CDATA[' + siteName + ']]></string></property>';       
    retVal += '</object>';  
    
    return retVal;              
}


//convert from requested resource uri to local file uri to read file contents
function readDependentFile(paramArgsAsString)
{       
    var mainFileURI = "";
    var requestedResourceURI = "";
	var siteName = "";

    var paramArray = decodeParamString(paramArgsAsString);
    if (paramArray && paramArray.length == 2)
    {
        requestedResourceURI = paramArray[0];
        mainFileURI =   paramArray[1];
    }   

    //DWfile.write(_jsMeerMeerDebugFile, requestedResourceURI, "append");   
    var retObject = _dwLocalFilePeer.readDependentFile(requestedResourceURI, mainFileURI, siteName);  
    var statusCode = retObject.statusCode;
    var dependentFileLocalURI = retObject.dependentFileLocalURI;
    var docSource = retObject.docSource;
    var docContentType = retObject.docContentType;

        
    //form the return value     
    var retVal = '<object>';
    retVal += '<property id="status"><string><![CDATA[' + statusCode + ']]></string></property>';       
    retVal += '<property id="dependentFileLocalURI"><string><![CDATA[' + dependentFileLocalURI + ']]></string></property>';     
    retVal += '<property id="dependentFileSource"><string><![CDATA[' + minDWEntityEncode(docSource) + ']]></string></property>';        
    retVal += '<property id="docContentType"><string><![CDATA[' + docContentType + ']]></string></property>';       
    retVal += '</object>';
    
    //DWfile.write(_jsMeerMeerDebugFile, retVal, "append");
    
    return retVal;              
}


//--------------------------------------------------------------------
//FUNCTION:
//checkPreConditions
//
//DESCRIPTION:
//Determines if pre conditions are met for testing server preview
//
//ARGUMENTS:
//bIsTestingServer 
//
//RETURNS:
//boolean, true if pre-conditions are met else display a Javascript alert and returns false
//--------------------------------------------------------------------
function checkPreConditions(paramArgsAsString)
{
	var retPreConditionsObj = new Object();
        
    var localDocURI = "";
    var previewURI = "";
    var isTestingServer = "";
    var isRemoteOnly = "";
    
    var paramArray = decodeParamString(paramArgsAsString);    
    if (paramArray && paramArray.length == 4)
    {
        localDocURI = paramArray[0];
        previewURI =   paramArray[1];
        isTestingServer = paramArray[2];        
        isRemoteOnly = paramArray[3];
    }   
    var bIsTestingServer = (isTestingServer == "true"); //preference (local/remote)
    var bIsRemoteFileOnly = (isRemoteOnly == "true"); //remote file (e.g. remote tree inside DW)
    
    if (bIsTestingServer)
    {   
        retPreConditionsObj = _dwRemoteServerPeer.checkPreConditions(previewURI, bIsRemoteFileOnly);
    }       
    else
    {
        //pre-conditions are met
        retPreConditionsObj = _dwLocalFilePeer.checkPreConditions(previewURI, bIsRemoteFileOnly, localDocURI); 
    }
            
    //form the return value
    var retVal = '<object>';
    retVal += '<property id="status"><' + retPreConditionsObj.bPreConditionsMet + '/></property>';                  
	retVal += '<property id="reason"><string><![CDATA[' + retPreConditionsObj.preConditionsReason + ']]></string></property>';      
    retVal += '</object>';  
    return retVal;  
}

//--------------------------------------------------------------------
//FUNCTION:
// requestURI
//
//DESCRIPTION:
//takes a sitename , URI and maps to file:/// path or htttp:// path
//
//ARGUMENTS:
//sitename, URI
//
//RETURNS:
// the file:/// URI path
//--------------------------------------------------------------------
function requestURI(paramArgsAsString) 
{
    var mainFileURI = ""; //keep it blank since sitename is recommended to do the mapping
	var siteName = "";
    var requestedResourceURI = "";
    var paramArray = decodeParamString(paramArgsAsString);
    if (paramArray && paramArray.length == 2)
    {
        siteName =   paramArray[0];
        requestedResourceURI = paramArray[1];
    }   

    //DWfile.write(_jsMeerMeerDebugFile, requestedResourceURI, "append");   
	//reload the permission store
	 /*if (_dwLocalFilePeer._permissionStore == null) {
		_dwLocalFilePeer.reloadPermissionStore();
	 }*/

    var retObject = _dwLocalFilePeer.readDependentFile(requestedResourceURI, mainFileURI,siteName);  
    var statusCode = retObject.statusCode;
    var dependentFileLocalURI = retObject.dependentFileLocalURI;
    var docSource = retObject.docSource;
    var docContentType = retObject.docContentType;
	var docCharSet = retObject.docCharSet;

	//special handling for file:///
	if (statusCode == "100") {
		if (_dwLocalFilePeer.isContentTypeText(dependentFileLocalURI)) {
			if (DWfile.exists(dependentFileLocalURI)) {

				//read file from local file system
				statusCode = "200";
				docSource = DWfile.read(dependentFileLocalURI);

				//quick search for file:// path in the source
				if ((docSource.indexOf(_dwLocalFilePeer._fileUrlPrefix) != -1) || (retObject.docSource.indexOf(_dwLocalFilePeer._localHostUrlPrefix) != -1)  || (retObject.docSource.indexOf(_dwLocalFilePeer._localHostSecureUrlPrefix) != -1))
				{
					//replace local uri
					docSource = _dwLocalFilePeer.convertLocalHostURLs(docSource);
				}	    

				//set the content type and docCharset
				docCharSet = _dwLocalFilePeer.getCharSetFromSource(docSource);
				//add the charset to contenttype
				docContentType = _dwLocalFilePeer.getContentTypeFromURI(retObject.dependentFileLocalURI, false) + "; charset=" + docCharSet;
			}
		}
	}
        
    //form the return value     
    var retVal = '<object>';
    retVal += '<property id="status"><string><![CDATA[' + statusCode + ']]></string></property>';       
    retVal += '<property id="requestedFileLocalURI"><string><![CDATA[' + dependentFileLocalURI + ']]></string></property>';     
    retVal += '<property id="requestedFileSource"><string><![CDATA[' + minDWEntityEncode(docSource) + ']]></string></property>';        
    retVal += '<property id="docContentType"><string><![CDATA[' + docContentType + ']]></string></property>';       
    retVal += '<property id="docCharSet"><string><![CDATA[' + docCharSet + ']]></string></property>';       
    retVal += '</object>';
    
    //DWfile.write(_jsMeerMeerDebugFile, retVal, "append");
    
    return retVal;              
}

//--------------------------------------------------------------------
//FUNCTION:
// replaceLocalHostURL
//
//DESCRIPTION:
// substitutes localhost URL and file URL for round trip reason from BL Service
//
//ARGUMENTS:
//source (e.g. http://localhost/foo/foo.html)
//
//RETURNS:
// replaced source with substituted URL (e.g. localhost_7697/foo/foo.html)
//--------------------------------------------------------------------
function replaceLocalHostURL(source) 
{
	var replacedStatusObj = _dwLocalFilePeer.replaceLocalHostURL(source);        
    
	//form the return value     
    var retVal = '<object>';    
	retVal += '<property id="replaced"><' + replacedStatusObj.bReplaced + '/></property>';          
	retVal += '<property id="substitutedURL"><string><![CDATA[' + replacedStatusObj.retStr + ']]></string></property>';
	retVal += '</object>';        
	
    return retVal;              
}


//--------------------------------------------------------------------
//FUNCTION:
// replaceLocalHostSource
//
//DESCRIPTION:
// substitutes localhost URL and file URL for round trip reason from BL Service
//
//ARGUMENTS:
//source (e.g. http://localhost/foo/foo.html)
//
//RETURNS:
// replaced source with substituted URL (e.g. localhost_7697/foo/foo.html)
//--------------------------------------------------------------------
function replaceLocalHostSource(source) 
{
	var bReplaced = false;

	//quick search for file:// path in the source
	if ((source.indexOf(_dwLocalFilePeer._fileUrlPrefix) != -1) || (source.indexOf(_dwLocalFilePeer._localHostUrlPrefix) != -1)  || (source.indexOf(_dwLocalFilePeer._localHostSecureUrlPrefix) != -1))
	{
		//replace local uri
		source = _dwLocalFilePeer.convertLocalHostURLs(source);
		bReplaced = true;
	}	    


	//get the content type and charset
	var docCharSet = _dwLocalFilePeer.getCharSetFromSource(source);
	var docContentType = "text/html; charset=" + docCharSet;
    
	//form the return value     
    var retVal = '<object>';    
	retVal += '<property id="replaced"><' + bReplaced + '/></property>';          
	if (bReplaced) {
		//append the substituted code 
		retVal += '<property id="substitutedSource"><string><![CDATA[' + source + ']]></string></property>';
	}
    retVal += '<property id="docContentType"><string><![CDATA[' + docContentType + ']]></string></property>';       
    retVal += '<property id="docCharSet"><string><![CDATA[' + docCharSet + ']]></string></property>';       
	retVal += '</object>';        
		
    return retVal;              
}

//--------------------------------------------------------------------
//FUNCTION:
//launchSettings
//
//DESCRIPTION:
//launches the settings dialog to change the list of white listed url & permission settings dialog.
//
//ARGUMENTS:
//none
//
//RETURNS:
//none
//--------------------------------------------------------------------
function launchPermissionSettings()
{
	//launch the permission settings dialog
	var resArray = dwscripts.callCommand("BL_PermissionSettings");	
	/*if (resArray && resArray.length)
	{		
		if (resArray == "reload")
		{			
			//reload the permission store when clicked ok
			_dwLocalFilePeer.reloadPermissionStore();
		}
	}*/
}


function clearGC() 
{
    if (_bMarkForGC)
    {
        //force a Garbage Collection
        dw.forceGarbageCollection();
        _bMarkForGC = false;
    }
}

function openLocURIinBrowser(paramArgsAsString)
{

    var paramArray = decodeParamString(paramArgsAsString);
    if (paramArray && paramArray.length == 2) {

		//serviceURI and clientLogging
		var serviceURI = paramArray[0];
		var clientLogging = paramArray[1];

		serviceURI += "?language=" + dw.getAppLanguage() + "#state=use;log=" + clientLogging + ";";

		//call the dw.browseDocument since it communicates over DDE (Dynamic Data Exchange) technique
		//to request focus to browser tab to come in front , it launches in the primary browser
		//specified inside DW tool.
		dw.browseDocument(serviceURI);
	}

}

//-------------------------------------------------------------------
//FUNCTION:
//getRandom()
//
//DESCRIPTION: Generates Random number.
//ARGUMENTS:
//none
//RETURNS:
//a Random number
//--------------------------------------------------------------------
function getRandom()
{
	return (Math.round(Math.random()*(10000-1000)))+1000;
}


//--------------------------------------------------------------------
//CLASS:DWBasePeer
// base class which 
//--------------------------------------------------------------------
function DWBasePeer()
{   
}

DWBasePeer.prototype =
{
    checkSitePreConditions : function()
    {       
        var bPreConditionsMet = true;
        //we need a DW site to be defined   
        var nSites = site.getSites();
        var bActiveSite = false;
        if (nSites.length > 0)
        {
            var currSite = site.getCurrentSite();
            if (currSite && (currSite.length > 0))
            {
                bActiveSite = true;
            }       
        }       
        if (bActiveSite == false)
        {
            //we need a testing to be defined.
            var defineTestingServerMsg = dw.loadString("meermeerdw/panel/defineSite");
            //alert(defineTestingServerMsg);
            var bRetVal = confirm(defineTestingServerMsg);
            if (bRetVal)
            {
                //launch a new site dialog
                site.newSite();
            }
            //fail to meet pre-conditions
            bPreConditionsMet = false;
        }   
        return bPreConditionsMet;
    },
    checkFilePreConditions : function(previewDocURI)
    {
        var bPreConditionsMet = true;
        //check for doc uri , if it valid for preview       
        if (previewDocURI == "null") //for null string
        {
            //empty local file uri
            previewDocURI = "";
        }                   
        var fileExt = dwscripts.getFileExtension(previewDocURI);
        fileExt = fileExt.toLowerCase();
        if (fileExt.length == 0)
        {
            //get the extension if extension is missing , assume it to be folder (which is non browser able), hence disable the preview
            var noDocSpecifiedMsg = dw.loadString("meermeerdw/panel/noDocSpecified");
            alert(noDocSpecifiedMsg);
            bPreConditionsMet = false; 
        }
        else if ((fileExt == "css") || (fileExt == "js") || (fileExt == "txt"))
        {
            //disable it for .css, .js files.
            var inValidFileExtensionMsg = dw.loadString("meermeerdw/panel/inValidFileExtension");
            alert(inValidFileExtensionMsg);
            bPreConditionsMet = false; 
        }   
        return bPreConditionsMet;
    },
    checkDocPreConditions: function(aDocument, previewMode)
    {
        //these conditions are for doc - open inside DW.
        var bRetStatus = true;
        if (aDocument && aDocument.URL.length == 0) 
        {
          //ask the user to save the document
          var saveMessage = dw.loadString("meermeerdw/panel/saveFile");
          if (confirm(saveMessage)) 
          {
              if (dw.canSaveDocument(dw.getDocumentDOM())) 
              {
                  dw.saveDocument(dw.getDocumentDOM());
              }           
              //still empty
              if (aDocument.URL.length == 0)
              {
                  bRetStatus = false; //unable to save file.
              }           
          }
          else
          {
              bRetStatus = false; //unable to save file.
          }
        }               
        if (bRetStatus)
        {
            //check if file belongs to site.
            bRetStatus = this.fileBelongsToSite(aDocument);
        }
        return bRetStatus;
    },
    fileBelongsToSite : function (aDocument)
    {
        var bRetStatus = true;
        if (aDocument != null)
        {
            aDocURI = aDocument.URL;            
            var aSite = site.getSiteForURL(aDocURI);
            if (aSite.length == 0)
            {
                bRetStatus = false; //unable to find a site containing the file.
                var fileNotInSiteMsgA = dw.loadString("meermeerdw/panel/fileNotInSite_A");
                var fileNotInSiteMsgB = dw.loadString("meermeerdw/panel/fileNotInSite_B");
                var fileName = dwscripts.getSimpleFileName(aDocURI);
                var fileExt = dwscripts.getFileExtension(aDocURI);
                fileName = fileName + "." + fileExt;
                fileNotInSiteMsgA = dwscripts.sprintf(fileNotInSiteMsgA, fileName);
                alert(fileNotInSiteMsgA + "\n\n" + fileNotInSiteMsgB);                
            }
        }
        return bRetStatus;
    },      
    IsRelatedFileDoc : function (absoluteFilePath)
    {
        absoluteFilePath = dw.doURLEncoding(absoluteFilePath, "", true);    
        if (absoluteFilePath && absoluteFilePath.length)
        {
            var nRelatedFiles;
            var relatedFileList = dw.getRelatedFiles(true); 
            var relatedFileIsOpen = false;
            if (relatedFileList.length && relatedFileList.length > 0) 
            {
                nRelatedFiles = relatedFileList.length; 
                for (var i=0;i< nRelatedFiles; i++) 
                {
                    if (absoluteFilePath == relatedFileList[i]) 
                    {
                        relatedFileIsOpen = true;
                        break;
                    }
                }
            }
        }
        return relatedFileIsOpen;
    },
    getMainDoc:function()
    {   
        var mainDocument = null; 
        var relatedFilePath = dw.getActiveRelatedFilePath();
        if (relatedFilePath.length)
        {
            //change the current document to parent html container instead of related file document  
            mainDocument = dw.getActiveWindow(); 
        }
        else
        {
            mainDocument = dw.getDocumentDOM();
            if (mainDocument && mainDocument.isDocumentInFrame())
            {
            	//get the containing frameset
            	mainDocument = dw.getActiveWindow();
            }
        }
        return mainDocument;
    },
    IsTextDoc:function (aDocURI)
    {
        var bIsTextDoc = false;
        var fileExt = dwscripts.getFileExtension(aDocURI);
        fileExt = fileExt.toLowerCase();    
        if ((fileExt == "js") || (fileExt == "txt"))
        {
            bIsTextDoc = true;
        }
        return bIsTextDoc;
    },  
    getPreviewURI:function(aDocURI)
    {
        var aPreviewURI = aDocURI;          
        //if site is defined and site app url prefix (testing server) is defined
        var aSite = site.getSiteForURL(aDocURI);            
        if (aSite.length)
        {
            var serverURLPrefix = this.getServerURLPrefix(aSite);
            if (serverURLPrefix && serverURLPrefix != "http://")
            {
                aPreviewURI = dwscripts.getSiteRelativePath(aPreviewURI);
                aPreviewURI = aPreviewURI.replace(/\\|:/g, "/");          
                //append to url prefix.
                if (serverURLPrefix[serverURLPrefix.length - 1] != '/')
                {
                    //add slash if missing.
                    if (aPreviewURI.indexOf("/") != 0)
                    {
                        aPreviewURI = "/" + aPreviewURI;
                    }
                }
                else
                {
                    if (aPreviewURI.indexOf("/") == 0)
                    {
                        aPreviewURI = aPreviewURI.substr(1);
                    }
                }           
                aPreviewURI = serverURLPrefix + aPreviewURI;            
            }   
        }
        return aPreviewURI;
    },
    fileIsCurrentlyOpenInsideDW : function (absoluteFilePath)
    {
        var openFilesArr = dw.getDocumentList(); 
        var fileIsOpen = false;
        var nOpenFiles;
        var i;
        // note: openFilesArr is an array of currently open document objects
        if (openFilesArr.length && openFilesArr.length > 0) 
        {
            nOpenFiles = openFilesArr.length; 
            for (i=0;i<nOpenFiles;i++) 
            {
                if (absoluteFilePath == openFilesArr[i].URL) 
                {
                    fileIsOpen = true;
                    break;
                }
            }
        }
        return fileIsOpen;      
    },
    toSiteRelativeURI : function(aDocument, localFileURI)
    {
        if (!aDocument && localFileURI.length)
        {
            //load the document - to resolve the site relative URL Prefix
            aDocument = dw.getDocumentDOM(localFileURI);
        }       
        if (aDocument)
        {
            siteRelativeURI = aDocument.localPathToSiteRelative(localFileURI);
            //use this function since it is more full proof
            //alert("siteRelativeURI::" + siteRelativeURI);
        }
        else
        {
            //fallback
            siteRelativeURI = dwscripts.getSiteRelativePath(localFileURI);
        }
        siteRelativeURI = siteRelativeURI.replace(/\\|:/g, "/");
        return siteRelativeURI;
    },
    convertFromSiteRelativeToLocalPath : function (requestedResourceURI, localFileURI, aSiteName)
    {
        //convert for site relative to local uri
        // - first try the current site
        // - then try other sites inside DW (since it could be sub-site)
        var dependentFileLocalURI = "";

		
		//map to site
		var aSite = "";
		if (aSiteName && aSiteName.length) {
			aSite = aSiteName; // if supplied
		}
		else {
			//get the site for which main file belongs
			aSite = site.getSiteForURL(localFileURI);		
			if (aSite.length == 0) {
				//set the sitename to current site
				aSite = site.getCurrentSite();
			}   
		}
            
        if (aSite.length)
        {
            //check the current site
            if (site.getAppURLPrefixForSite(aSite) != "http://")
            {
                dependentFileLocalURI = site.siteRelativeToLocalPath(requestedResourceURI,aSite);
                if (dependentFileLocalURI.length)
                {
                    dependentFileLocalURI = dwscripts.filePathToLocalURL(dependentFileLocalURI);
                }
            }
			else 
			{
				//if the site is missing URL prefix try trimming the URL and re-mapping
				requestedResourceURI = this.trimURLParams(requestedResourceURI);
                dependentFileLocalURI = site.siteRelativeToLocalPath(requestedResourceURI,aSite);
                if (dependentFileLocalURI.length)
				{
                    dependentFileLocalURI = dwscripts.filePathToLocalURL(dependentFileLocalURI);
				}
			}

            var curSiteRootURL = null;
            if (dependentFileLocalURI.length == 0)
            {
                //get the current site local root url
                curSiteRootURL = site.getLocalRootURL(aSite);       
                var curSiteLength = curSiteRootURL.length;
                if (curSiteRootURL[curSiteLength - 1] == '/')
                {
                    curSiteRootURL = curSiteRootURL.substring(0,curSiteLength -1);
                }               
                //form a completed path
                var aDependentFileLocalURI = curSiteRootURL + requestedResourceURI;
                //confirm if the dependent file exist
                if (DWfile.exists(aDependentFileLocalURI))
                {
                    dependentFileLocalURI = aDependentFileLocalURI;
                }       
            }

            //if still does not exist , look in sibling folders
            if (dependentFileLocalURI.length == 0)
            {
                //move up a parent
                var lastSlashIndex = curSiteRootURL.lastIndexOf("/");
                var parentSiteRootURL = curSiteRootURL.substring(0, lastSlashIndex);
                
                //get the site name for this parent url if defined inside DW.
                var parentSiteName = site.getSiteForURL(parentSiteRootURL);
                if (parentSiteName.length)
                {
                    //check the current site
                    if (site.getAppURLPrefixForSite(parentSiteName) != "http://")
                    {
                        dependentFileLocalURI = site.siteRelativeToLocalPath(requestedResourceURI, parentSiteName);
                        if (dependentFileLocalURI.length)
                        {
                            dependentFileLocalURI = dwscripts.filePathToLocalURL(dependentFileLocalURI);
                        }               
                    }
                }
                
                if (dependentFileLocalURI.length == 0)
                {
                    //form a completed path
                    var aDependentFileLocalURI = parentSiteRootURL + requestedResourceURI;
                    //confirm if the dependent file exist at sibling levels of site root folder
                    if (DWfile.exists(aDependentFileLocalURI))
                    {
                        dependentFileLocalURI = aDependentFileLocalURI;
                    }
                }
            }   
        }

        return dependentFileLocalURI;
    },
    getContentTypeFromURI : function (aDocURI, isDependentFile)
    {
        var aContentType = "";
        var fileExt = dwscripts.getFileExtension(aDocURI);
        if (fileExt && fileExt.length)
        {
            fileExt = fileExt.toLowerCase();    
            if (fileExt && fileExt.length)
            {
                fileExt = fileExt.toLowerCase();    
                if (fileExt == "js")
                {
                    aContentType = "text/javascript"; 
                }
                else if (fileExt == "css")
                {
                    aContentType = "text/css";
                }
                else if (fileExt == "swf")
                {
                    aContentType = "application/swf";
                }
                else if (fileExt == "gif")
                {
                    aContentType = "image/gif";
                }
                else if (fileExt == "png")
                {
                    aContentType = "image/png";
                }
                else if (fileExt == "tiff")
                {
                    aContentType = "image/tiff";
                }
                else if ( (fileExt == "jpg") || (fileExt == "jpeg"))
                {
                    aContentType = "image/jpeg";
                }
                else
                {
                    if (!isDependentFile)
                    {
                        aContentType = "text/html";
                    }
                }
            }
        }
        return aContentType;
    },
    isContentTypeText : function (aDocURI)
    {
        var isText = true;
        var fileExt = dwscripts.getFileExtension(aDocURI);
        if (fileExt && fileExt.length)
        {
            fileExt = fileExt.toLowerCase();    
            if (fileExt && fileExt.length)
            {
                if (fileExt == "swf")
                {
                    isText = false;
                }
                else if (fileExt == "gif")
                {
                    isText = false;
                }
                else if (fileExt == "png")
                {
                    isText = false;
                }
                else if (fileExt == "tiff")
                {
                    isText = false;
                }
                else if ( (fileExt == "jpg") || (fileExt == "jpeg"))
                {
                    isText = false;
                }
            }
        }
        return isText;
    },
    getCharSet : function (aDocument)
    {
        var aCharSet = null;
        if (aDocument)
        {
            aCharSet = aDocument.getCharSet();
            if (aCharSet && aCharSet.length)
            {
                //to be appended to content type
                aCharSet = "; charset=" + aCharSet;             
            }
        }
        return aCharSet;
    },
    getCharSetOnly : function (aDocument)
    {
        var aCharSet = null;
        if (aDocument)
        {
            aCharSet = aDocument.getCharSet();
        }
        return aCharSet;
    },
    getCharSetFromSource : function (docSource)
    {
        var aCharSet = null;
        if (docSource)
        {
			var metaRegExp = /<[\s]*meta[\s].*?charset[\s]*=[\s]*["\']?([^>"\']*)["\']?/ig;
            var searchIndex = docSource.search(metaRegExp);
			if (searchIndex != -1) {
				aCharSet = RegExp.$1;
			}
        }
        return aCharSet;
    },  	  
    getSiteIndex : function (aSiteName)
    {
      var siteIndex = -1;
      var siteSummarySection = "Sites\\-Summary";
      var noOfSites = dw.getPreferenceInt(siteSummarySection, "Number of Sites", 0);
      for (var i=0; i < noOfSites; i++)
      {
         siteSection = "Sites\\-Site" + i;
         siteName = dw.getPreferenceString(siteSection, "Site Name");
         if(siteName == aSiteName)
         {
            siteIndex = i;
            break;
         }  
      }
      return siteIndex;     
    },  
    getServerURLPrefix: function (aSite)
    {
        var serverURLPrefix = site.getAppURLPrefixForSite(aSite);
        /*var siteIndex = this.getSiteIndex(aSite);
        if (siteIndex != -1)
        {
            var siteSection = "Sites\\\\-Site" + siteIndex;
            var isTestingServerSelected = site.isTestingServerSelected();
            if (!isTestingServerSelected)
            {
                serverURLPrefix = dw.getPreferenceString(siteSection, "Root URL");
            }
            else
            {
                serverURLPrefix = dw.getPreferenceString(siteSection, "URL Prefix");
            }
        }*/   
        return serverURLPrefix;     
    },
    IsValidFileURI: function (aURI)
    {
        var bIsValidFile = false;
        if (aURI && aURI.length)
        {
            if ((aURI.indexOf("=") != -1) ||
                (aURI.indexOf(";") != -1) ||
                (aURI.indexOf("+") != -1) ||
                (aURI.indexOf("|") != -1))  
            {
                bIsValidFile = false;
            }
            else
            {
                bIsValidFile = true;
            }
        }
        return bIsValidFile;
    },
    trimURLParams : function (aURI)
    {
        var retURI = aURI;
        //look for "?" for URL Parameter
        var qIndex = retURI.indexOf("?");
        if (qIndex != -1)
        {
            //eliminate URL params;
            retURI = retURI.substring(0, qIndex);
        }       
        return retURI;
    },
	trimHTTPPrefix:function (aURL)
	{
		var retURL = aURL;
		if (aURL.indexOf("http://") == 0)
		{
			retURL = aURL.substring(7);
		}
		else if (aURL.indexOf("https://") == 0)
		{
			retURL = aURL.substring(8);
		}
		else if (aURL.indexOf("file:///") == 0)
		{
			retURL = aURL.substring(8);
		}
		return retURL;
	},
    isEnabledRelatedDoc : function()
    {
        var bEnabledRelatedDoc = true;
        var strEnableRelateDoc = dw.getPreferenceString("General Preferences", "Show Related Docs");
        strEnableRelateDoc = strEnableRelateDoc.toLowerCase();
        if (strEnableRelateDoc == "false")
        {
            bEnabledRelatedDoc = false;
        }
        return bEnabledRelatedDoc;
    },
	savePreference: function (aPrefKey, aPrefValue)
	{
		var bSavedPreference = false;
		var savePreferenceString = '<invoke name="setPreference" returntype="xml"><arguments>';
		savePreferenceString+= '<string><![CDATA[' + aPrefKey + ']]></string>';
		savePreferenceString+= '<string><![CDATA[' + aPrefValue + ']]></string>';
		savePreferenceString+= '</arguments></invoke>';		
		var hasSavePreferenced = dw.flash.controlEvent(_gMeerMeerDWService, savePreferenceString);
		bSavePreferenced = (hasSavePreferenced == "<true/>");
		return bSavePreferenced;
	},
	getPreference: function (aPrefKey)
	{
		var aPrefValue = "";
		var getPreferenceString = '<invoke name="getPreference" returntype="xml"><arguments>';
		getPreferenceString+= '<string><![CDATA[' + aPrefKey + ']]></string>';
		getPreferenceString+= '</arguments></invoke>';
		aPrefValue = dw.flash.controlEvent(_gMeerMeerDWService, getPreferenceString);
		return aPrefValue;		
	},
	isAbsoluteURL : function (aURL)
	{
		var bIsAbsoluteURL = false;
		if ((aURL.indexOf("http://") == 0) || (aURL.indexOf("https://") == 0) || (aURL.indexOf("file:///") == 0))
		{
			bIsAbsoluteURL = true;
		}
		return bIsAbsoluteURL;
	},
	isHttpURL : function (aURL)
	{
		var bIsHttpURL = false;
		if ((aURL.indexOf("http://") == 0) || (aURL.indexOf("https://") == 0))
		{
			bIsHttpURL = true;
		}
		return bIsHttpURL;
	},
	isFileURL : function (aURL)
	{
		var bIsFileURL = false;
		if (aURL.indexOf("file:///") == 0)
		{
			bIsFileURL = true;
		}
		return bIsFileURL;
	},
	getHostUrl : function (aURL)
	{
		var hostUrl = "";			
		var startIndex = 0;

		if ((aURL.indexOf("http://") == 0) || (aURL.indexOf("https://") == 0))
		{
			startIndex = 7;
		}
		
		//get the start index.
		var firstSlashIndex = aURL.indexOf("/", startIndex);
		if (firstSlashIndex != -1)
		{	
			hostUrl = aURL.substring(0, firstSlashIndex);
		}

		if (hostUrl.length)
		{
			var bIsAbsUrl = this.isAbsoluteURL(hostUrl);
			if (!bIsAbsUrl)
			{
				//append the default http://
				hostUrl = "http://" + hostUrl;
			}
		}

		return hostUrl;
	},
	getQueryString : function (aURL)
	{
		var queryString = "";
		if (aURL && aURL.length)
		{
			var qsIndex = aURL.indexOf("?");
			if (qsIndex != -1)
			{
				queryString = aURL.substring(qsIndex);
			}
		}
		return queryString;
	}	    
};

//--------------------------------------------------------------------
//CLASS:DWLocalFileJSPeer
//peer js calls which handle uploads to Remote file/server
//--------------------------------------------------------------------
function DWLocalFileJSPeer()
{
	this._fileURLMaps = new Array(); //list of replaced file URL and actual file URL   
	this._httpURLMaps = new Array(); //list of http referenced URL

	//local host prefix
	this._fileUrlPrefix = "file:///";
	this._localHostUrlPrefix = "http://localhost";
	this._localHostSecureUrlPrefix = "https://localhost";

	//set the reg-ex for replacing.
	this._fileUrlRegExp = new RegExp("file:///(?:[\\w\\|\\:]+)?", "ig");
	this._localHostUrlRegExp = new RegExp("http://localhost(?:\\:\\d+)?", "ig");
	this._localHostSecureUrlRegExp = new RegExp("https://localhost(?:\\:\\d+)?", "ig");;

	//substitute url prefix on which random # is appended
	this._fileUrlSubstitutePrefix = "/fileURL_";
	this._localHostUrlSubstitutePrefix = "/localhostURL_";
}

DWLocalFileJSPeer.prototype = new DWBasePeer();

//list of dynamic feeds.
DWLocalFileJSPeer._dynamicFeedExts = new Array("cfm","cfml","cfc","asp","jsp","jst","aspx","ascx","asmx","php","php3","php4","php5");

DWLocalFileJSPeer.prototype.isLocalPreviewAllowed = function() 
{
	var bIsLocalPreviewAllowed = false;
	var allowLocalContentPrefValue = this.getPreference(_allowLocalContentPrefKey);		
	if (allowLocalContentPrefValue && allowLocalContentPrefValue.length) {			
	  allowLocalContentPrefValue = allowLocalContentPrefValue.toLowerCase();
	  if (allowLocalContentPrefValue.indexOf("allow") != -1) {
		bIsLocalPreviewAllowed = true;
	  }
	}
	return bIsLocalPreviewAllowed;
}


DWLocalFileJSPeer.prototype.getLocalPreviewPermission = function() 
{
	var localPreviewPermission = "Allow"; //default is allowed
	var allowLocalContentPrefValue = this.getPreference(_allowLocalContentPrefKey);		
	if (allowLocalContentPrefValue && allowLocalContentPrefValue.length) {			
	  allowLocalContentPrefValue = allowLocalContentPrefValue.toLowerCase();
	  if (allowLocalContentPrefValue.indexOf("allow") != -1) {
		localPreviewPermission = "Allow";
	  }
	  else if (allowLocalContentPrefValue.indexOf("deny") != -1) {
		localPreviewPermission = "Deny";
	  }
	}
	return localPreviewPermission;
}

DWLocalFileJSPeer.prototype.checkAllowLocalPreviewConditions = function() 
{	
 	var retPreConditionsObj = new Object();
    retPreConditionsObj.bPreConditionsMet = false;		
	retPreConditionsObj.preConditionsReason = "NA";

	var bIsLocalPreviewAllowed = this.isLocalPreviewAllowed();
	if (bIsLocalPreviewAllowed) {
		retPreConditionsObj.bPreConditionsMet = true;
	}
	else {
		//prompt the user if set to deny or notset
		var resArray = dwscripts.callCommand("BL_PermissionSettings");		
		bIsLocalPreviewAllowed = this.isLocalPreviewAllowed();	
		if (bIsLocalPreviewAllowed) {
			retPreConditionsObj.bPreConditionsMet = true;
		}
		else {
			if (resArray && resArray.length) {
				if (resArray == "cancel") {
					retPreConditionsObj.preConditionsReason = "cancel";
				}
			}
		}
	}
	return retPreConditionsObj;
}

DWLocalFileJSPeer.prototype.checkPreConditions = function(previewDocURI, bIsRemoteFileOnly, localDocURI)
{
    //checks if all pre-conditions are met for local file use case
	var retPreConditionsObj = new Object();
	retPreConditionsObj.bPreConditionsMet = false;		
	retPreConditionsObj.preConditionsReason = "NA";
		
    if (!bIsRemoteFileOnly)
    {
		//check for local permission dialog
		var preConditionsObjStatus = this.checkAllowLocalPreviewConditions();
		retPreConditionsObj.bPreConditionsMet = preConditionsObjStatus.bPreConditionsMet;
		retPreConditionsObj.preConditionsReason = preConditionsObjStatus.preConditionsReason;

		if (retPreConditionsObj.bPreConditionsMet) {
			retPreConditionsObj.bPreConditionsMet = this.checkSitePreConditions(); //check the site pre-conditions
		}
        if (retPreConditionsObj.bPreConditionsMet)
        {
            retPreConditionsObj.bPreConditionsMet = this.checkFilePreConditions(previewDocURI); //check the file pre-conditions     
        }
		if (retPreConditionsObj.bPreConditionsMet)
		{			
			//get document.			
			var bIsDynamic = false;			
			var aDoc = this.getMainDoc();			
			if (aDoc)
			{
				var designViewMode =  aDoc.getDesignViewMode();
				if (designViewMode == "editable")
				{				
					//if it is dynamic page - warn the user - that dynamic page needs to be in live view.
					if (this.isDynamic(previewDocURI))
					{
						var dynamicPageMsg = dw.loadString("meermeerdw/panel/dynamicPageMessage");
						alert(dynamicPageMsg);
						retPreConditionsObj.bPreConditionsMet = false; 									
					}
				}
			}
			else
			{
				//if it is dynamic page - warn the user - that dynamic page needs to be in live view.
				//could be dynamic doc from files panel
				if (this.isDynamic(previewDocURI))
				{
					var dynamicPageMsg = dw.loadString("meermeerdw/panel/dynamicPageMessage");
					alert(dynamicPageMsg);
					retPreConditionsObj.bPreConditionsMet = false; 									
				}
			}

			
			/*
			if (retPreConditionsObj.bPreConditionsMet)
			{			
				//check for permission on http domains.
				var preConditionsObjStatus = this.checkForHTTPDomains(localDocURI);				
				retPreConditionsObj.bPreConditionsMet = preConditionsObjStatus.bPreConditionsMet;
				retPreConditionsObj.preConditionsReason = preConditionsObjStatus.preConditionsReason;
			}
			*/
		}
    }
    else
    {
        retPreConditionsObj.bPreConditionsMet = true; //since it remote file we can skip the above checks.
    }

    return retPreConditionsObj;
}

DWLocalFileJSPeer.prototype.isDynamic = function(previewDocURI)
{
	var bIsDynamic = false;
	var fileExt = dwscripts.getFileExtension(previewDocURI);
	for (var i=0; i < DWLocalFileJSPeer._dynamicFeedExts.length; i++)
	{
		if (DWLocalFileJSPeer._dynamicFeedExts[i] == fileExt)
		{
			bIsDynamic = true;
			break;
		}
							
	}
	return bIsDynamic;					
}

DWLocalFileJSPeer.prototype.checkForHTTPDomains = function(localFileURI)
{
	var retPreConditionsObj = new Object();

    retPreConditionsObj.bPreConditionsMet = true;		
	retPreConditionsObj.preConditionsReason = "NA";
	
	if (this._permissionStore == null)
	{
		//reload the permission store.
		this.reloadPermissionStore();
	}		

    var bIsFileURI = (localFileURI && localFileURI.length); 
    var currentDocument = null; 
    if (bIsFileURI)
    {
        //check if the document is open inside DW (as top level documents)
        if (this.fileIsCurrentlyOpenInsideDW(localFileURI))
        {
            currentDocument = dw.getDocumentDOM(localFileURI);
        }
    }
    else
    {
        //get the current document
        currentDocument = this.getMainDoc();
    }   

	var docSource = null;
    if (currentDocument)
	{
        //get the source of the document loaded in memory
        if (currentDocument.getDesignViewMode() == "live")
        {
            //get source in live view
            docSource = currentDocument.browser.getSource();
        }
        else
        {
            //get source in edit view
            docSource =  currentDocument.source.getText();
        }       
	}
    else
    {
        //did not find open document
        //use the DWfile object to read the file contents
        if (bIsFileURI)
        {
            docSource = DWfile.read(localFileURI);
        }
    }
	
	if (docSource)
	{
		//check if the source has http:// or https:// content type
		if ((docSource.indexOf("http://") != -1) || (docSource.indexOf("https://") != -1) || (docSource.indexOf("file://") != -1))
		{
			// ask the user for permission for dependent domains
			this._httpURLMaps = new Array(); //list of http referenced URL

			this.findHTTPDomains(docSource);
			
			//check if the page is referencing absolute linked assets
			var bHasDomains = false;
			for (var aDomain in this._httpURLMaps)
			{
				bHasDomains = true;
				break;
			}

			if (bHasDomains)
			{
				var domainNeedingPermission = this.getDomainNeedingPermission(this._httpURLMaps);
				if (domainNeedingPermission.length > 0)
				{
					var cmdFile = dreamweaver.getConfigurationPath() + '/Commands/BL_Ask.htm';
					var cmdDOM = dreamweaver.getDocumentDOM(cmdFile);
					if (cmdDOM)
					{
						var cmdWin = cmdDOM.parentWindow;    
						cmdWin.setDomainList(domainNeedingPermission);
					}

					//reload the permission store.			
					var resArray = dwscripts.callCommand("BL_Ask");
					if (resArray && resArray.length)
					{
						if ((resArray == "allow") || (resArray == "deny") || (resArray == "allowAlways") || (resArray == "denyAlways"))
						{
							//reload the permission store.
							this.reloadPermissionStore();
						}
						else
						{
							//cancelled
							retPreConditionsObj.bPreConditionsMet = false;
							retPreConditionsObj.preConditionsReason = "cancel";
						}
					}
					else
					{
						//cancelled
						retPreConditionsObj.bPreConditionsMet = false;
						retPreConditionsObj.preConditionsReason = "cancel";
					}
				}
			}
									
		}
	}
	
    return retPreConditionsObj;	  
}

DWLocalFileJSPeer.prototype.getLocalDocSource = function(localFileURI)
{   
    var retObject = new Object();
    retObject.bRetStatus = true;
    retObject.bIsPausedLiveCode = false;
    retObject.docSource = "";
    retObject.docContentType = ""; //default to empty.
    retObject.docCharSet = ""; //default to empty -> which default to UTF-8 in AS
    
    var bIsFileURI = (localFileURI && localFileURI.length); 
    var currentDocument = null; 
    if (bIsFileURI)
    {
        //check if the document is open inside DW (as top level documents)
        if (this.fileIsCurrentlyOpenInsideDW(localFileURI))
        {
            currentDocument = dw.getDocumentDOM(localFileURI);
        }
    }
    else
    {
        //get the current document
        currentDocument = this.getMainDoc();
    }   
    
    if (currentDocument)
    {
        //get content type from DW doc.
        retObject.docContentType = this.getContentTypeFromURI(currentDocument.URL, false) + this.getCharSet(currentDocument);
        retObject.docCharSet = this.getCharSetOnly(currentDocument); 
        
        //get the source of the document loaded in memory
        if (currentDocument.getDesignViewMode() == "live")
        {
            //get source in live view
            retObject.docSource = currentDocument.browser.getSource();
            retObject.bIsPausedLiveCode = true;
        }
        else
        {
            //get source in edit view
            retObject.docSource =  currentDocument.source.getText();
        }       
    }
    else
    {
        //did not find open document
        //use the DWfile object to read the file contents
        if (bIsFileURI)
        {
            retObject.docSource = DWfile.read(localFileURI);
        }
        else
        {
            retObject.bRetStatus = false;
        }
    }   
    
	//quick search for file:// path in the source
	if ((retObject.docSource.indexOf(this._fileUrlPrefix) != -1) || (retObject.docSource.indexOf(this._localHostUrlPrefix) != -1)  || (retObject.docSource.indexOf(this._localHostSecureUrlPrefix) != -1))
	{
		this._fileURLMaps = new Array();

		//substitute the file:/// url(s) with relative path 
		retObject.docSource = this.convertLocalHostURLs(retObject.docSource);
	}	    
    
    //set the current doc in ret Object
    retObject.currentDocument = currentDocument;
    
    return retObject;
}

DWLocalFileJSPeer.prototype.extractDomain = function(aDomain)
{
	//extract the domain portion.
    var attrValSlashIndex = -1;		
	var httpDomain = aDomain;
	if (aDomain.indexOf("https://") == 0)
	{
		attrValSlashIndex = aDomain.indexOf("/", 8);
		if (attrValSlashIndex != -1)
		{
    		httpDomain = aDomain.substring(0,attrValSlashIndex);
		}
	}
	else if (aDomain.indexOf("http://") == 0)
	{
		attrValSlashIndex = aDomain.indexOf("/", 7);
		if (attrValSlashIndex != -1)
		{
    		httpDomain = aDomain.substring(0,attrValSlashIndex);
		}
	}					
	else if (aDomain.indexOf("file://") == 0)
	{
		var lastSlashIndex = aDomain.lastIndexOf("/");
		if (lastSlashIndex != -1)
		{
			httpDomain = aDomain.substring(0,lastSlashIndex);
			//replace the pipe char with ":"
			httpDomain = httpDomain.replace("|",  ":");
		}						
	}	

	return httpDomain;
}

DWLocalFileJSPeer.prototype.findHTTPDomains = function(docSource) 
{	
	//create a temporary 
	var aTempDOM = dwscripts.getEmptyDOM();
	aTempDOM.documentElement.outerHTML = docSource;
	var elems = new Array();
    dwscripts.traverseDOM(aTempDOM.documentElement, this.findHttpURLAttrs,null,null,elems);
    if (elems && elems.length)
    {
    	var elemLen = elems.length; 
    	for (var i=0 ; i < elemLen; i++)
    	{
    		var anElementNode = elems[i];
					
            var attrLen = anElementNode.attributes.length;
            for (var k=0 ; k < attrLen; k++)
            {
            	var aAttrKey = anElementNode.attributes[k].name;
    			var aAttrVal = anElementNode.attributes[k].value;
    			if (aAttrVal && ((aAttrVal.indexOf("http://") == 0) || (aAttrVal.indexOf("https://") == 0) || (aAttrVal.indexOf("file://") == 0))) 
    			{
					var extractedDomain = this.extractDomain(aAttrVal);
    				this._httpURLMaps[extractedDomain] = extractedDomain;    		    					
    			}			
            }		    		
    	}
    }
}

DWLocalFileJSPeer.prototype.findHttpURLAttrs = function(node,elemArray)
{
	if (node && node.attributes)
	{
		//(skip anchor , form elements , html element)
		var aTagName = node.tagName;
		aTagName = aTagName.toLowerCase();
		if ((aTagName == "form") || (aTagName == "html"))
		{
			return true;
		}

        var attrLen = node.attributes.length;
        for (var k=0 ; k < attrLen; k++)
        {
        	var aAttrKey = node.attributes[k].name;

			//skip xmlns attribute
			if (aAttrKey.indexOf("xmlns") != -1)
			{
				continue;
			}

			var aAttrVal = node.attributes[k].value;
			if (aAttrVal && ((aAttrVal.indexOf("http://") == 0) || (aAttrVal.indexOf("https://") == 0) || (aAttrVal.indexOf("file://") == 0))) 
			{
				elemArray.push(node);
				break;
			}			
        }		
	}	  
	return true;	
}

DWLocalFileJSPeer.prototype.getDomainNeedingPermission = function(domainMap)
{
	//filter out domains which already have permission set to allow or deny by looking up permission store
	var aDomainArray = new Array();

	for (var aDomain in domainMap)
	{
		var anURLMetaInfo = this._permissionStore[aDomain];
		if  (anURLMetaInfo == null)
		{
			//add the domain if we cannot locate in the map.
			aDomainArray.push(aDomain);
		}
	}
	
	return aDomainArray;
}


DWLocalFileJSPeer.prototype.replaceLocalHostURL = function(elementInnerContents)
{
	var replacedStatusObj = new Object();
	replacedStatusObj.bReplaced = false; //false by default.
	replacedStatusObj.retStr = "";

	if (elementInnerContents && elementInnerContents.length)
	{			
		//replace http://localhost
		if (elementInnerContents.indexOf(this._localHostUrlPrefix) != -1)
		{				
			var localHostMatches = elementInnerContents.match(this._localHostUrlRegExp);
			if (localHostMatches.length > 0)
			{					
				//replaced matches localhost urls
				for (var i=0; i < localHostMatches.length; i++)
				{
					var aLocalHostUrlPrefix = localHostMatches[i];

					//form a unique replacement url
					var replacedUrlPrefix = this._localHostUrlSubstitutePrefix + getRandom();
					this._fileURLMaps[replacedUrlPrefix] = aLocalHostUrlPrefix;

					elementInnerContents = elementInnerContents.replace(aLocalHostUrlPrefix, replacedUrlPrefix);
				}							
			
				//set replaced state to true
				replacedStatusObj.bReplaced = true;				

				//set the return value
				replacedStatusObj.retStr = elementInnerContents;
			}
		}

		//replace file:///
		if (elementInnerContents.indexOf(this._fileUrlPrefix) != -1)
		{				
			var fileUrlMatches = elementInnerContents.match(this._fileUrlRegExp);
			if (fileUrlMatches.length > 0)
			{					
				//replaced matches localhost urls
				for (var i=0; i < fileUrlMatches.length; i++)
				{
					var aFileUrlPrefix = fileUrlMatches[i];

					//form a unique replacement url
					var replacedUrlPrefix = this._fileUrlSubstitutePrefix + getRandom();
					this._fileURLMaps[replacedUrlPrefix] = aFileUrlPrefix;

					elementInnerContents = elementInnerContents.replace(aFileUrlPrefix, replacedUrlPrefix);
				}							
			
				//set replaced state to true
				replacedStatusObj.bReplaced = true;				

				//set the return value
				replacedStatusObj.retStr = elementInnerContents;
			}
		}


		//replace https:///
		if (elementInnerContents.indexOf(this._localHostSecureUrlPrefix) != -1)
		{				
			var secureLocalHostMatches = elementInnerContents.match(this._localHostSecureUrlRegExp);
			if (secureLocalHostMatches.length > 0)
			{					
				//replaced matches localhost urls
				for (var i=0; i < secureLocalHostMatches.length; i++)
				{
					var secureLocalHostUrlPrefix = secureLocalHostMatches[i];

					//form a unique replacement url
					var replacedUrlPrefix = this._localHostUrlSubstitutePrefix + getRandom();
					this._fileURLMaps[replacedUrlPrefix] = secureLocalHostUrlPrefix;

					elementInnerContents = elementInnerContents.replace(secureLocalHostUrlPrefix, replacedUrlPrefix);
				}							
			
				//set replaced state to true
				replacedStatusObj.bReplaced = true;				

				//set the return value
				replacedStatusObj.retStr = elementInnerContents;
			}
		}

	}
	
	return replacedStatusObj; 
}


DWLocalFileJSPeer.prototype.convertLocalHostURLs = function(docSource) 
{	
	//create a temporary 
	var aTempDOM = dwscripts.getEmptyDOM();
	aTempDOM.documentElement.outerHTML = docSource;
	var elems = new Array();
    dwscripts.traverseDOM(aTempDOM.documentElement, this.findFileURLAttrs,null,null,elems);
    if (elems && elems.length)
    {
    	var elemLen = elems.length; 
    	for (var i=0 ; i < elemLen; i++)
    	{
    		var anElementNode = elems[i];
			var aTagName = anElementNode.tagName;
			aTagName = aTagName.toLowerCase();
			if ((aTagName == "style") || (aTagName == "script"))
			{
				//replace localhost url's in innerHTML contents;
				var elementInnerContents = anElementNode.innerHTML;
				var replacedStatusObj = this.replaceLocalHostURL(elementInnerContents);				
				if (replacedStatusObj.bReplaced)
				{
					anElementNode.innerHTML = replacedStatusObj.retStr;
				}
			}

            var attrLen = anElementNode.attributes.length;
            for (var k=0 ; k < attrLen; k++)
            {
            	var aAttrKey = anElementNode.attributes[k].name;
				var aAttrVal = anElementNode.attributes[k].value;

    			if (aAttrVal)
    			{

					var bPrefixFound = false;
					var prefixFound = null;  //which prefix matched
					var replacedAttrVal = "";  //random url prefix
					var startIndex = "";	   //start index

					if (aAttrVal.indexOf(this._fileUrlPrefix) == 0)
					{
    					//get random url replacement.
						prefixFound = this._fileUrlPrefix;
    					replacedAttrVal = this._fileUrlSubstitutePrefix + getRandom();
						startIndex =  prefixFound.length;
						bPrefixFound = true;
					}
					else if (aAttrVal.indexOf(this._localHostUrlPrefix) == 0)
					{
    					//get random url replacement.
						prefixFound = this._localHostUrlPrefix;
    					replacedAttrVal = this._localHostUrlSubstitutePrefix + getRandom();
						startIndex =  prefixFound.length;
						bPrefixFound = true;
					}
					else if (aAttrVal.indexOf(this._localHostSecureUrlPrefix) == 0)
					{
    					//get random url replacement.
						prefixFound = this._localHostSecureUrlPrefix;
    					replacedAttrVal = this._localHostUrlSubstitutePrefix + getRandom();
						startIndex =  prefixFound.length;
						bPrefixFound = true;
					}
					
					if (bPrefixFound)
					{
						//get the remaining portion of the URL string
						var attrLength = aAttrVal.length;
						if (attrLength < startIndex )
						{
							startIndex = attrLength;
						}
						var attrValSlashIndex = aAttrVal.indexOf("/", startIndex);	
						if (attrValSlashIndex != -1)
						{							
							var urlPrefix = aAttrVal.substring(0, attrValSlashIndex);
							this._fileURLMaps[replacedAttrVal] = urlPrefix;    	
																			
    						//replace the attribute value with new prefix which we serve
    						replacedAttrVal += aAttrVal.substring(attrValSlashIndex);
							anElementNode.setAttribute(aAttrKey,replacedAttrVal);							
						}
					}
    			}			
            }		    		
    	}
    }
    return aTempDOM.documentElement.outerHTML;
}

DWLocalFileJSPeer.prototype.findFileURLAttrs = function(node,elemArray)
{
	if (node && node.attributes)
	{
		//(skip anchor , form elements , html element)
		var aTagName = node.tagName;
		aTagName = aTagName.toLowerCase();
		if ((aTagName == "a") || (aTagName == "form") || (aTagName == "html"))
		{
			//skip anchor element tags
			return true;
		}	
		else if (aTagName == "style")
		{
			//style tag
			elemArray.push(node);
			return true;
		}					
		else if (aTagName == "script")  
		{
			//script tag
			elemArray.push(node);
			return true;
		}					

        var attrLen = node.attributes.length;        
		for (var k=0 ; k < attrLen; k++)
        {
        	var aAttrKey = node.attributes[k].name;

			//skip xmlns attribute
			if (aAttrKey.indexOf("xmlns") != -1)
			{
				continue;
			}    			

			var aAttrVal = node.attributes[k].value;
			if (aAttrVal)
			{
				if ((aAttrVal.indexOf("file:///") == 0) ||  
					(aAttrVal.indexOf("http://localhost") == 0) || 
					(aAttrVal.indexOf("https://localhost") == 0))
				{
					elemArray.push(node);
					break;
				}			
			}
        }		
	}	  
	return true;	
}

DWLocalFileJSPeer.prototype.lookUpLocalHostAttr = function(aFileURL)
{	
	var actualFileURL = "";

	//look up host url
	var localHostUrlPrefixIndex = aFileURL.indexOf(this._localHostUrlSubstitutePrefix);
	if (localHostUrlPrefixIndex != -1)
	{
		var keyPrefixIndex = aFileURL.indexOf("/",this._localHostUrlSubstitutePrefix.length);		
		if (keyPrefixIndex != -1)
		{
			var urlPrefix = aFileURL.substring(0, keyPrefixIndex);
			var actualFileURLPrefix = this._fileURLMaps[urlPrefix];
			if (actualFileURLPrefix)
			{
				actualFileURL = actualFileURLPrefix + aFileURL.substring(keyPrefixIndex);
			}
		}
	}
	else
	{
		var fileUrlPrefixIndex = aFileURL.indexOf(this._fileUrlSubstitutePrefix);
		if (fileUrlPrefixIndex != -1)
		{
			var keyPrefixIndex = aFileURL.indexOf("/",this._fileUrlSubstitutePrefix.length);		
			if (keyPrefixIndex != -1)
			{
				var urlPrefix = aFileURL.substring(0, keyPrefixIndex);
				var actualFileURLPrefix = this._fileURLMaps[urlPrefix];
				if (actualFileURLPrefix)
				{
					actualFileURL = actualFileURLPrefix + aFileURL.substring(keyPrefixIndex);
				}
			}
		}
	}
	
	return actualFileURL;
}


DWLocalFileJSPeer.prototype.readDependentFile = function(requestedResourceURI, mainFileURI, siteName)
{   
    var retObject = new Object();   
    retObject.statusCode = "0";  //failure
    retObject.docSource = "";
    retObject.dependentFileLocalURI = "";
    retObject.docContentType = ""; //default to empty.          
	retObject.permissionLevel = "Ask"; //default Ask permission level
	retObject.docCharSet = "utf-8"; //set the default charset
    var dependentFileLocalURI = ""; 
    
    //do url decoding
    requestedResourceURI = dw.doURLDecoding(requestedResourceURI);

    //do url decoding for sitename to handle double byte characters
	if (siteName && siteName.length) {
		siteName = dw.doURLDecoding(siteName);
	}

	if (requestedResourceURI.charAt(0) == '/') // site relative path
	{
		//look if file:/// absolute urls
		var lookUpFileURL = this.lookUpLocalHostAttr(requestedResourceURI);
		if (lookUpFileURL && lookUpFileURL.length)
		{
			//replace with the actual file name
			requestedResourceURI = lookUpFileURL; 
		}
	}

    if (requestedResourceURI.charAt(0) == '/') // site relative path
    {
		retObject.dependentFileLocalURI = this.convertFromSiteRelativeToLocalPath(requestedResourceURI, mainFileURI, siteName);

        var fileExt = dwscripts.getFileExtension(retObject.dependentFileLocalURI);
        var bIsFile = (fileExt.length > 0); //eliminate folder.
        if (retObject.dependentFileLocalURI.length && bIsFile)
        {
            if (DWfile.exists(retObject.dependentFileLocalURI))
            { 
				//var resourcePermissionLevel = this.checkPermissionForResource(retObject.dependentFileLocalURI, mainFileURI, siteName);
				var resourcePermissionLevel = this.getLocalPreviewPermission();

				if (resourcePermissionLevel == "Deny")
				{
					retObject.statusCode = "403"; //resource is denied permission.
				}
				else if (resourcePermissionLevel == "Cancel")
				{
					retObject.statusCode = "600"; //resource is cancelled
				}
				else
				{          
					retObject.statusCode = "100"; //translated from site relative to local file uri, open inside flex code since it is not loaded/opened inside DW 
					retObject.docContentType = this.getContentTypeFromURI(retObject.dependentFileLocalURI, true);
				}
            }
            else
            {
				//relative file assets - unable to locate it locally , try hitting the server instead based on appUrlPrefix and host base address.
				var aHostUrl = this.getHostUrl(site.getAppURLPrefixForSite());
				if (aHostUrl.length)
				{
					retObject.dependentFileLocalURI = aHostUrl + requestedResourceURI;
					if (this.isAbsoluteURL(retObject.dependentFileLocalURI))
					{
						//var resourcePermissionLevel = this.checkPermissionForResource(retObject.dependentFileLocalURI, mainFileURI, siteName);
						var resourcePermissionLevel = this.getLocalPreviewPermission();

						if (resourcePermissionLevel == "Deny")
						{
							retObject.statusCode = "403"; //resource is denied permission.
						}
						else if (resourcePermissionLevel == "Cancel")
						{
							retObject.statusCode = "600"; //resource is cancelled
						}
						else
						{
							//read resource 
							retObject.statusCode = "100"; //translated from site relative to local file uri, open inside flex code since it is not loaded/opened inside DW 
							retObject.docContentType = this.getContentTypeFromURI(retObject.dependentFileLocalURI, true);
						}					
					}
					else
					{
						retObject.statusCode = "404"; //unable to locate dependent file
					}					
				}
				else
				{
						retObject.statusCode = "404"; //unable to locate dependent file
				}
            }
        }
        else
        {
            retObject.statusCode = "404"; //unable to locate dependent file
        }
    }
    else
    {
		retObject.dependentFileLocalURI = requestedResourceURI;
		if (this.isAbsoluteURL(retObject.dependentFileLocalURI))
		{
			//var resourcePermissionLevel = this.checkPermissionForResource(retObject.dependentFileLocalURI, mainFileURI, siteName);
			var resourcePermissionLevel = this.getLocalPreviewPermission();

			if (resourcePermissionLevel == "Deny")
			{
				retObject.statusCode = "403"; //resource is denied permission.
			}
			else if (resourcePermissionLevel == "Cancel")
			{
				retObject.statusCode = "600"; //resource is cancelled
			}
			else
			{
				//read resource 
				retObject.statusCode = "100"; //translated from site relative to local file uri, open inside flex code since it is not loaded/opened inside DW 
				retObject.docContentType = this.getContentTypeFromURI(retObject.dependentFileLocalURI, true);
			}					
		}
		else
		{
			retObject.statusCode = "404"; //unable to locate dependent file
		}
    }
    
	if (!this.isHttpURL(retObject.dependentFileLocalURI))
	{
		//check if dependent file is open in DW Editor, get is *unsaved* content.
		if ((retObject.statusCode != "404") && (retObject.statusCode != "403"))
		{
			if (retObject.dependentFileLocalURI.length > 0)
			{                       
				if (this.IsRelatedFileDoc(retObject.dependentFileLocalURI) || this.fileIsCurrentlyOpenInsideDW(retObject.dependentFileLocalURI))
				{
					//doc - is open inside DW.
					//in live view when related doc is enabled (opening dependent file like css using getDocumentDOM takes the
					//live view out of its frozen state due to reload.
					var dependentFileDoc = dw.getDocumentDOM(retObject.dependentFileLocalURI);
					if (dependentFileDoc)
					{
						retObject.docSource = dependentFileDoc.source.getText();
						retObject.docContentType = this.getContentTypeFromURI(retObject.dependentFileLocalURI, true);
						retObject.docCharSet = dependentFileDoc.getCharSet();
						
						//quick search for file:// path in the source
						if ((retObject.docSource.indexOf(this._fileUrlPrefix) != -1) || (retObject.docSource.indexOf(this._localHostUrlPrefix) != -1)  || (retObject.docSource.indexOf(this._localHostSecureUrlPrefix) != -1))
						{
							var docContentType = retObject.docContentType;
							if ((docContentType == "text/css") || (docContentType == "text/javascript")) 
							{
								//replace local uri - use reg-ex form of substitution for the whole page
								var replacedStatusObj = this.replaceLocalHostURL(retObject.docSource);				
								if (replacedStatusObj.bReplaced)
								{
									retObject.docSource = replacedStatusObj.retStr;
								}						
							}
							else 
							{
								////replace local uri - use DOM form of substitution for the whole page
								retObject.docSource = this.convertLocalHostURLs(retObject.docSource);
							}
						}	    

						retObject.statusCode = "200"; //has doc contents which are more current than the one stored on user disk
					}
				}
			}
			else
			{
				//not found.
				retObject.statusCode = "404"; //unable to locate dependent file
			}
		}
	}

    return retObject;
}

DWLocalFileJSPeer.prototype.checkPermissionForResource = function(requestedResourceURI, mainFileURI, aSiteName)
{
	var bDone = false;
	var permissionLevel = "Ask"; //default.	

	var aRequestedResourceURI = requestedResourceURI;
	if (aRequestedResourceURI.indexOf("file:///") != -1)
	{
		//replace the pipe char with ":"
		aRequestedResourceURI = aRequestedResourceURI.replace("|",  ":");
	}

	//set the domain list
	var domainNeedingPermission = new Array();

	//by default file:/// assets belong to current site are allowed				
	while (!bDone)
	{
		var anURLMetaInfo = this._permissionStore[aRequestedResourceURI];
		if (anURLMetaInfo)
		{
			permissionLevel = anURLMetaInfo.getPermission();
			bDone = true;
		}
		else
		{
			//trim the URL further.
			var lastSlashIndex = aRequestedResourceURI.lastIndexOf("/");
			if (lastSlashIndex != -1)
			{
				aRequestedResourceURI = aRequestedResourceURI.substring(0, lastSlashIndex);
			}
			else
			{
				bDone = true;
			}
		}
	}

	if (permissionLevel == "Ask")
	{
		// file:/// if they originate from primary site ,subsites 
		if (requestedResourceURI.indexOf("file:///") != -1)
		{
			aRequestedResourceURI = requestedResourceURI;

			//allow assets for primary site 
			//var aSite = site.getSiteForURL(mainFileURI);   

			//map to site
			var aSite = "";
			if (aSiteName && aSiteName.length) {
				aSite = aSiteName; // if supplied
			}
			else {
				//get the site for which main file belongs
				aSite = site.getSiteForURL(mainFileURI);		
				if (aSite.length == 0) {
					//set the sitename to current site
					aSite = site.getCurrentSite();
				}   
			}

			var curSiteRootURL = site.getLocalRootURL(aSite);       
			if (aRequestedResourceURI.indexOf(curSiteRootURL) != -1)
			{
				permissionLevel = "Allow";
			}	

			//allow assets from parent (subsite) 
			var lastSlashIndex = curSiteRootURL.lastIndexOf("/");
			var parentSiteRootURL = curSiteRootURL.substring(0, lastSlashIndex);
			var parentSiteName = site.getSiteForURL(parentSiteRootURL);
			if (parentSiteName.length)
			{
				if (aRequestedResourceURI.indexOf(parentSiteRootURL) != -1)
				{
					permissionLevel = "Allow";
				}	
			}

			if (permissionLevel == "Ask")
			{
				var lastSlashIndex = aRequestedResourceURI.lastIndexOf("/");
				if (lastSlashIndex != -1)
				{
					aRequestedResourceURI = aRequestedResourceURI.substring(0, lastSlashIndex);
					domainNeedingPermission.push(aRequestedResourceURI);
				}				
			}
		}
		else
		{
			var httpDomain = this.extractDomain(requestedResourceURI);
			domainNeedingPermission.push(httpDomain);
		}
	}
			
	if (permissionLevel == "Ask")
	{

		var cmdFile = dreamweaver.getConfigurationPath() + '/Commands/BL_Ask.htm';
		var cmdDOM = dreamweaver.getDocumentDOM(cmdFile);
		if (cmdDOM)
		{
			var cmdWin = cmdDOM.parentWindow;    
			cmdWin.setDomainList(domainNeedingPermission);
		}

		var resArray = dwscripts.callCommand("BL_Ask");
				
		if (resArray && resArray.length)
		{
			if (resArray == "allow")
			{
				permissionLevel = "Allow";

				//reload the permission store.
				this.reloadPermissionStore();
			}
			else if (resArray == "allowAlways")
			{
				permissionLevel = "Allow";
				//reload the permission store.
				this.reloadPermissionStore();
			}
			else if (resArray == "deny")
			{
				permissionLevel = "Deny";
				//reload the permission store.
				this.reloadPermissionStore();
			}
			else if (resArray == "denyAlways")
			{
				permissionLevel = "Deny";
				//reload the permission store.
				this.reloadPermissionStore();
			}
			else if (resArray == "cancel")
			{
				//abort the process.
				permissionLevel = "Cancel";
			}
		}
		else
		{
			//deny if unable to launch the dialog
			permissionLevel = "Deny";
		}
	}		
	return permissionLevel;	
}

//loads/reads permission from a file.
DWLocalFileJSPeer.prototype.reloadPermissionStore = function(bForceReload)
{	
	//create a list of URL & corresponding permission level
	if (MM._permissionStore && !bForceReload)
	{
		//load it from in memory version
		this._permissionStore = MM._permissionStore.getPermissions();
	}
	else
	{
		//load it from disk.
		this._permissionStore = new Array();		
		var permissionStoreExists = DWfile.exists(PERMISSION_STORE_FILE);
		if (permissionStoreExists)
		{
			//read it from store/persisted entry.
			var jsonStoreCode = DWfile.read(PERMISSION_STORE_FILE);		
			if (jsonStoreCode && jsonStoreCode.length)
			{
				eval(jsonStoreCode);
				//reload the UI with stored entries
				for (var i=0;i < permissionStore.length; i++)
				{
					var aURLPermissionPair = permissionStore[i];
					var aURL = aURLPermissionPair.URL;
					var aPermission = aURLPermissionPair.Permission;

					//add it to map.
					var aURLMetaInfo = new URLMetaInfo(aURL, aPermission);
					this._permissionStore[aURL] = aURLMetaInfo; 	
				}
			}
		}				
	}
}


//--------------------------------------------------------------------
//FUNCTION:
//showWarningForLocalFiles
//
//DESCRIPTION:
//This function displays an informational dialog, with the 
//"don't show me this again option".  If the user selects this
//option, then the given preference is set, and the dialog will
//not be displayed the next time this function is called.
//
//Example:
//askOkCancel("message",
//"Extensions\\Objects\\NewThing","SkipNewThingWarning");
//
//ARGUMENTS:
//message - string - the message to display.  Please note that
//returns should be included in the message.  This dialog does
//not automatically wrap.
//prefSection - string - the section where this preference should
//be stored
//prefKey - string - the name of the key in which this preference
//should be stored
//
//RETURNS:
//if the user turned off the dialog return false
//also return false if the user dismisses the dialog
//otherwise return true
//--------------------------------------------------------------------				
DWLocalFileJSPeer.prototype.showWarningDialogForLocalFiles = function(message)
{
	if (message)
	{    
		 // check if the registryKey is already set
		 var retVal = false
		 // if not set, display the alert
		 var cmdName = 'ConfirmDS.htm';
		 var cmdFile = dreamweaver.getConfigurationPath() + '/Commands/' + cmdName;
		 var cmdDOM = dreamweaver.getDocumentDOM(cmdFile);
		 if (cmdDOM)
		 {
			 var cmdWin = cmdDOM.parentWindow; 
			 // Pass one arg for OK/Cancel, or extra args to define btns
			 if (dwscripts.IS_WIN)
			 {
				 cmdWin.render(message, MM.BTN_Yes, MM.BTN_No);
			 }
			 else
			 {
				 cmdWin.render(message, MM.BTN_No, MM.BTN_Yes);
			 }	
			 dreamweaver.popupCommand(cmdName);
			 retVal = (MMNotes.Confirm_RESULT == MM.BTN_Yes); // Reference to confirm global result.        
			 // now set the registry key based on the result
			 dontShowAgain = MMNotes.Confirm_DONOTSHOW;
			 //save as CSXS Preference to show the warning dialog next time or not	
			 this.savePreference(_gShowLocalFilesWarningDialogPreference, !dontShowAgain);
			 //save as CSXS Preference if the user has allowed us permission or not
			 this.savePreference(_gLocalFilesUploadPreference, retVal);
		  }
	}  
	return retVal;
}	

//--------------------------------------------------------------------
//CLASS:URLMetaInfo
//url meta info class which stores the url & permission 
//--------------------------------------------------------------------
function URLMetaInfo(url, permission)
{
	this._url = url;
	this._permission = permission;
}

URLMetaInfo.prototype =
{		
	getURL:function()
	{
		return this._url;
	},
	getPermission:function()
	{
		return this._permission;
	},
	setURL:function(anURL)
	{
		this._url = anURL;
	},
	setPermission:function(aPermission)
	{
		this._permission = aPermission;
	}
};



//--------------------------------------------------------------------
//CLASS:DWRemoteServerJSPeer
//peer js calls which handle uploads to Remote file/server
//--------------------------------------------------------------------
function DWRemoteServerJSPeer()
{   
}
DWRemoteServerJSPeer.prototype = new DWBasePeer();

DWRemoteServerJSPeer.prototype.checkPreConditions = function(previewDocURI, bIsRemoteFileOnly)
{
    //checks if all pre-conditions are met for remote server use case
    //if site is defined and site app url prefix (testing server) is defined
	var retPreConditionsObj = new Object();
	retPreConditionsObj.bPreConditionsMet = false;		
	retPreConditionsObj.preConditionsReason = "NA";


    if (!bIsRemoteFileOnly) //already has a site.
    {
        retPreConditionsObj.bPreConditionsMet = this.checkSitePreConditions(); //check the site pre-conditions  
        if (retPreConditionsObj.bPreConditionsMet)
        {       
            if (site.getAppURLPrefixForSite() && site.getAppURLPrefixForSite() != "http://")
            {
                retPreConditionsObj.bPreConditionsMet = true; 
            }
            else
            {
                //we need a testing to be defined.
                var defineTestingServerMsg = dw.loadString("meermeerdw/panel/defineTestingServer");
                var bRetVal = confirm(defineTestingServerMsg);
                if (bRetVal)
                {
                    //launch a new site dialog
                    site.showTestingServerSettings();
                }               
                retPreConditionsObj.bPreConditionsMet = false; 
            }
        }
    }
    else
    {
        retPreConditionsObj.bPreConditionsMet = true; //since it remote file we can skip the above checks.
    }
    
    if (retPreConditionsObj.bPreConditionsMet)
    {
        retPreConditionsObj.bPreConditionsMet = this.checkFilePreConditions(previewDocURI); //check the file pre-conditions
    }
    
    if (retPreConditionsObj.bPreConditionsMet)
    {
        //get document.
        var aDoc = this.getMainDoc();       
		if (aDoc)
		{
			if (aDoc.getDesignViewMode() == "live")
			{
				//get the filename part of the main document.
				var aDocFileName = aDoc.URL;        
				var slashIndex = aDocFileName.lastIndexOf("/");
				if (slashIndex != -1)
				{
					aDocFileName = aDocFileName.substring(slashIndex+1);
				}
            
				//get the filename part of the preview document.
				var previewDocFileName = previewDocURI;
				slashIndex = previewDocFileName.lastIndexOf("/");
				if (slashIndex != -1)
				{
					previewDocFileName = previewDocFileName.substring(slashIndex+1);
				}

				//if they match.
				if (aDocFileName == previewDocFileName)
				{
					//warn the user - that live view only works for Local Preview.
					var liveViewMsg = dw.loadString("meermeerdw/panel/liveViewMessage");
					alert(liveViewMsg);
					retPreConditionsObj.bPreConditionsMet = false;              
				}
			}       
		}
    }
        
    return retPreConditionsObj;
}

DWRemoteServerJSPeer.prototype.isRemoteServerSetUp = function()
{
        var bTestingServerURIDefined = (site.getAppURLPrefixForSite() && site.getAppURLPrefixForSite() != "http://");
        return bTestingServerURIDefined
}

DWRemoteServerJSPeer.prototype.publishDoc = function (localFileURI, previewURI)
{
    var retObject = new Object();
    
    var bUploadStatus = false;
    var bCancelled = false;
    if (this.isRemoteServerSetUp())
    {
        if (localFileURI && localFileURI.length)
        {
            //upload the page via the site configuration to "User Test Server"                      
            var bUpdateCopyOnServer = true;
            var bShowUpdateCopyOnServerWarningDlg = dw.getPreferenceString("Site Preferences", "Update Copy On Application Server", -1);
            bShowUpdateCopyOnServerWarningDlg = bShowUpdateCopyOnServerWarningDlg.toUpperCase();
            if (bShowUpdateCopyOnServerWarningDlg != "FALSE")
            {
                //to launch the dialog again.
                var updateCopyOnServerMsg = dw.loadString("meermeerdw/panel/uploadCopyOnTestServer");
                bUpdateCopyOnServer = this.askUploadToTestingServerOK(updateCopyOnServerMsg, "Site Preferences", "Update Copy On Application Server", -1);          
            }           
            if (bUpdateCopyOnServer)
            {
                var uploadStatus = site.put(localFileURI);
                //DWfile.write(_jsMeerMeerDebugFile, "upload status::" + uploadStatus, "append");
                if ((uploadStatus < 0) || (uploadStatus == IDS_SITE_NOSITEFORFILE) || (uploadStatus == IDS_FILE_IN_MULTIPLE_SITES))
                {
                    bUploadStatus = false;
                    if (uploadStatus == -1)
                    {
                        bCancelled = true;
                    }
                }       
                else
                {
                    bUploadStatus = true;
                }
            }
            else
            {
                bUploadStatus = false; //since the preference is not set to update copy on test server, user did not proceed to upload.
                bCancelled = true;
            }
        }
        else
        {
            bUploadStatus = false; //if the local file uri is null
        }
    }
    
    //attach the return values
    retObject.bUploadStatus = bUploadStatus;
    retObject.bCancelled = bCancelled;
    
    return retObject;
}

//--------------------------------------------------------------------
//FUNCTION:
//uploadToTestingServer
//
//DESCRIPTION:
//This function displays an informational dialog, with the 
//"don't show me this again option".  If the user selects this
//option, then the given preference is set, and the dialog will
//not be displayed the next time this function is called.
//
//Example:
//  askOkCancel("message",
//  "Extensions\\Objects\\NewThing","SkipNewThingWarning");
//
//ARGUMENTS:
//message - string - the message to display.  Please note that
//  returns should be included in the message.  This dialog does
//  not automatically wrap.
//prefSection - string - the section where this preference should
//  be stored
//prefKey - string - the name of the key in which this preference
//  should be stored
//
//RETURNS:
//if the user turned off the dialog return false
//also return false if the user dismisses the dialog
//otherwise return true
//--------------------------------------------------------------------              
DWRemoteServerJSPeer.prototype.askUploadToTestingServerOK = function(message, prefSection, prefKey, dontShowAgain)
{
    if (message && prefSection && prefKey)
    {    
     // check if the registryKey is already set
     var retVal = false
     // if not set, display the alert
     if (dontShowAgain == -1)
     {
       var cmdName = 'ConfirmDS.htm';
       var cmdFile = dreamweaver.getConfigurationPath() + '/Commands/' + cmdName;
       var cmdDOM = dreamweaver.getDocumentDOM(cmdFile);
       if (cmdDOM)
       {
         var cmdWin = cmdDOM.parentWindow; 
         // Pass one arg for OK/Cancel, or extra args to define btns
        if (dwscripts.IS_WIN)
        {
            cmdWin.render(message, MM.BTN_Yes, MM.BTN_No);
        }
        else
        {
            cmdWin.render(message, MM.BTN_No, MM.BTN_Yes);
        }   
        dreamweaver.popupCommand(cmdName);
        retVal = (MMNotes.Confirm_RESULT == MM.BTN_Yes); // Reference to confirm global result.        
         // now set the registry key based on the result
         dontShowAgain = MMNotes.Confirm_DONOTSHOW;
         if (dontShowAgain) 
         {
           dw.setPreferenceString(prefSection, prefKey, !dontShowAgain);
         }
       }
     }
     else
     {
       retVal = false ;
     }
    }  
    return retVal;
}   


