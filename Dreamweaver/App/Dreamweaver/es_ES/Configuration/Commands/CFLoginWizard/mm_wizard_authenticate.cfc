<cfcomponent>

<!---- ////////////////////////////////////////////////////--->
<!---- NT Domain Authentication							   --->
<!---- ////////////////////////////////////////////////////--->

<cffunction name="ntauth" access="private" output="false" returntype="struct" hint="Autenticar en un dominio NT">
<cfargument name="nusername" required="true" hint="El nombre de usuario">
<cfargument name="npassword" required="true" hint="La contraseña">
<cfargument name="ndomain" required="true" hint="El dominio en el que autenticar">
<cfset var retargs = StructNew()>

<CFNTAuthenticate
username="#arguments.nusername#"
password="#arguments.npassword#"
 	domain="#arguments.ndomain#"
	listGroups="yes"
 	result="authenticated">

         <cfif authenticated.status eq "success">
<cfset retargs.authenticated = "YES">
<cfelse>
<cfset retargs.authenticated = "NO">
</cfif>
<!--- return role here, default role is always "user" --->
<cfset retargs.roles = ListPrepend(retargs.groups, "user")>
<cfreturn retargs>
</cffunction>

<!---- ////////////////////////////////////////////////////--->
<!---- LDAP Authentication 								   --->
<!---- ////////////////////////////////////////////////////--->

<cffunction name="ldapauth" access="private" output="true" returntype="struct" hint="Autenticar en un dominio LDAP." >
  <cfargument name="lServer" required="true" hint="El servidor LDAP.">
  <cfargument name="lPort" hint="El puerto en el que se ejecuta el servidor LDAP.">
  <cfargument name="sUsername" required="true" hint="El nombre de usuario establecido en el Asistente para la conexión.">
  <cfargument name="sPassword" required="true" hint="La contraseña establecida en el Asistente para la conexión.">
  <cfargument name="uUsername" required="true" hint="El nombre de usuario pasado desde el cliente.">
  <cfargument name="uPassword" required="true" hint="La contraseña pasada desde el cliente.">
  <cfargument name="sQueryString" required="true" hint="La cadena que se va a pasar al servidor LDAP">
  <cfargument name="lStart" required="true">
 
  <cfset var retargs = StructNew()>
  <cfset var username = replace(sQueryString,"{username}",uUserName)>

  <cfldap action="QUERY"
	  name="userSearch"
	  attributes="dn"
	  start="#arguments.lStart#"
	  server="#arguments.lServer#"
	  port="#arguments.lPort#"
	  username="#arguments.sUsername#"
	  password="#arguments.sPassword#"  > 
	
<!--- If user search failed or returns 0 rows abort --->
<cfif  userSearch.recordCount EQ "" >
  <cfoutput>Error</cfoutput>"
 </cfif>

<!--- pass the user's DN and password to see if the user authenticates and get the user's roles --->

  <cfldap 
	action="QUERY"
	name="auth"
	attributes="dn,roles"
	start="#arguments.lStart#"
	server="#arguments.lServer#"
	port="#arguments.lPort#"
	username="#username#"
	password="#arguments.uPassword#" >

	<!--- If the LDAP query returned a record, the user is valid. --->
	<cfif auth.recordCount>
		<cfset retargs.authenticated="YES">
		 <!--- return role here, default role is always "user" --->
 		<cfset retargs.roles = "user">
</cfif>
<cfreturn retargs>
</cffunction>

<!---- ////////////////////////////////////////////////////--->
<!---- Simple Authtentication								 --->
<!---- ////////////////////////////////////////////////////--->

<cffunction name="simpleauth" access="private" output="false" returntype="struct" hint="Autenticar con un solo nombre de usuario y contraseña">
<cfargument name="sUserName" required="true" hint="El nombre de usuario configurado en el Asistente para la conexión.">
<cfargument name="sPassword" required="true" hint="La contraseña configurada en el Asistente para la conexión.">
<cfargument name="uUserName" required="true" hint="El nombre de usuario pasado desde el cliente.">
<cfargument name="uPassword" required="true" hint="La contraseña pasada desde el cliente.">
<cfset var retargs = StructNew()>

<cfif sUserName eq uUserName AND sPassword eq uPassword>
<cfset retargs.authenticated="YES">
<cfset retargs.roles = "user">
<cfelse>
<cfset retargs.authenticated="NO">
</cfif>
<cfreturn retargs>
</cffunction>

 <!---- ////////////////////////////////////////////////////--->
<!--- This method performs the <cflogin> call and in turn  --->
 <!--- calls the actual authentication method               --->
<!---- ////////////////////////////////////////////////////--->
<cffunction name="performlogin" access="public" output="true" hint="Conectar usuario mediante la autenticación NT, LDAP o sencilla (un nombre de usuario y contraseña predefinidos).">
<cfargument name="args" type="struct" required="true" hint="Son parámetros configurados por el Asistente para la conexión">
<cfset var x = "4YB4B7U">
<cfset var y = "U7B4BY4">
<cflogin>
 <cfif NOT IsDefined("cflogin")>
	<cfif args.authLogin eq "challenge">
		<cfheader statuscode="401">
		<cfheader name="www-Authenticate" value="Basic realm="MM Wizard #args.authtype# Authentication">
	<cfelse>
	  	<cfinclude template="#args.loginform#">
	  </cfif>
	  <cfabort>
 <cfelse>
       <cftry>
<cfif args.authtype eq "NT">
<cfinvoke method="ntauth"
returnvariable="result"
nusername="#cflogin.name#"
npassword="#cflogin.password#"
ndomain="#args.domain#" >

<cfelseif args.authtype eq "LDAP">
<cfinvoke method="ldapauth" returnvariable="result"
lStart="#args.start#"
lServer="#args.server#"
lPort="#args.port#"
				   sUserName="#args.suser#"
				   sPassword="#args.spwd#"
				   sQueryString="#args.queryString#"
				   uUsername="#cflogin.name#"
uPassword="#cflogin.password#">
				</cfinvoke>
			<cfelseif args.authtype eq "Simple">
				<cfinvoke method="simpleauth" returnvariable="result"
					sUserName="#args.suser#"
sPassword="#args.spwd#"	
					uUserName="#cflogin.name#"
					uPassword="#hash(x&cflogin.password&y,'SHA-1')#">
				</cfinvoke>
			</cfif>
		<cfcatch>
			<cfset loginFailed = true>
		<cfif args.authLogin eq "challenge">
			<cfheader statuscode="401">
			<cfheader name="www-Authenticate" value="Basic realm="MM Wizard #args.authtype# Authentication">
		<cfelse>
	  		<cfinclude template="#args.loginform#">
	  	</cfif>
			<cfabort>
		</cfcatch>
		</cftry>
	</cfif>
		<!--- validate if the user is authenticated --->
	   <cfif result.authenticated eq "YES">
	   			<!--- if authenticated --->
				<cfloginuser name="#cflogin.name#" password="#cflogin.password#" roles="#result.roles#">
			<cfelse>
				<!--- if not authenticated, return to login form with an error message --->
				<cfset loginFailed = true>
		<cfif args.authLogin eq "challenge">
			<cfheader statuscode="401">
			<cfheader name="www-Authenticate" value="Basic realm="MM Wizard #args.authtype# Authentication">
		<cfelse>
	  		<cfinclude template="#args.loginform#">
	  	</cfif>
			<cfabort>
   		</cfif>
  </cflogin>
</cffunction>
<!---- ////////////////////////////////////////////////////--->
							<!--- Logout  --->
<!---- ////////////////////////////////////////////////////--->
<cffunction name="logout" access="remote" output="true" hint="Desconectar usuario.">
<cfargument name="logintype" type="string" required="yes" hint="El tipo de conexión utilizada para conectar.">
	<cfif isDefined("form.logout")>
		<cflogout>
			<cfif arguments.logintype eq "challenge">
				<cfset foo = closeBrowser()>
			<cfelse>
				<!--- replace this URL to a page logged out users should see --->
				<cflocation url="http://www.macromedia.com">
			</cfif>
	</cfif>
</cffunction>

<!---- ////////////////////////////////////////////////////--->
 <!--- Close Browser  --->
<!--- To ensure the header authentication information --->
<!--- has been thouroughly flushed the browser should be closed --->
<!---- ////////////////////////////////////////////////////--->"
<cffunction name="closeBrowser" access="public" output="true" hint="Cerrar el navegador para borrar la información de encabezado.">
	<script language="javascript">
		if(navigator.appName == "Microsoft Internet Explorer") {
alert("El navegador se cerrará para completar la desconexión.");
			window.close();
		}
		 if(navigator.appName == "Netscape") {
alert("Para completar la desconexión, debe cerrar este navegador.");
   }
</script>
</cffunction>
</cfcomponent>
