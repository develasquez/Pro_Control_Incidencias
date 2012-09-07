Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Web.Script.Services
Imports System.Data

' Para permitir que se llame a este servicio Web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la siguiente línea.
<System.Web.Script.Services.ScriptService()> _
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsLog
    Inherits System.Web.Services.WebService
    <System.Web.Script.Services.ScriptMethod(ResponseFormat:=ResponseFormat.Json)> _
    <System.Web.Services.WebMethod(True)> _
    Public Function LogJSON(ByVal logIp As String, _
                        ByVal logNombreUsuario As String, _
                        ByVal logErrorNro As String, _
                        ByVal logErrorMsg As String, _
                        ByVal logErrorInternoMsg As String, _
                        ByVal logArchivoFuente As String, _
                        ByVal logMetodo As String, _
                        ByVal logVersionSistema As String, _
                        ByVal sitioCod As Integer) As String


        Dim Serializar As clsJsonSR.clsJsonSR = New clsJsonSR.clsJsonSR
        Dim conexion As New Mok.SqlConexion(ConfigurationManager.ConnectionStrings("Liquidacion").ConnectionString)
        Dim tablaLog As DataTable
        Dim parametros As Mok.SqlParametros = New Mok.SqlParametros
        parametros.Add("@logIp", logIp, Data.SqlDbType.Text)
        parametros.Add("@logNombreUsuario", logNombreUsuario, Data.SqlDbType.Text)
        parametros.Add("@logErrorNro", logErrorNro, Data.SqlDbType.Text)
        parametros.Add("@logErrorMsg", logErrorMsg, Data.SqlDbType.Text)
        parametros.Add("@logErrorInternoMsg", logErrorInternoMsg, Data.SqlDbType.Text)
        parametros.Add("@logArchivoFuente", logArchivoFuente, Data.SqlDbType.Text)
        parametros.Add("@logMetodo", logMetodo, Data.SqlDbType.Text)
        parametros.Add("@logVersionSistema", logVersionSistema, Data.SqlDbType.Text)
        parametros.Add("@SitioCod", sitioCod, Data.SqlDbType.Int)
        tablaLog = conexion.GetDataTable("pa_insertaLog", CommandType.StoredProcedure, parametros)

        Return (Serializar.listaParaCombobox(False, tablaLog, Nothing))


    End Function
    <System.Web.Script.Services.ScriptMethod(ResponseFormat:=ResponseFormat.Json)> _
<System.Web.Services.WebMethod(True)> _
    Public Function LogListaErrores(ByVal idLastLog As Integer) As String


        Dim Serializar As clsJsonSR.clsJsonSR = New clsJsonSR.clsJsonSR
        Dim conexion As New Mok.SqlConexion(ConfigurationManager.ConnectionStrings("Liquidacion").ConnectionString)
        Dim tablaLog As DataTable
        Dim parametros As Mok.SqlParametros = New Mok.SqlParametros
        parametros.Add("@idLastLog", idLastLog, Data.SqlDbType.Int)
        tablaLog = conexion.GetDataTable("pa_obtieneListaErrores", CommandType.StoredProcedure, parametros)
        Return (Serializar.listaParaCombobox(True, tablaLog, Nothing))

    End Function
    <System.Web.Script.Services.ScriptMethod(ResponseFormat:=ResponseFormat.Json)> _
<System.Web.Services.WebMethod(True)> _
    Public Function LogListaSitios() As String

        Dim Serializar As clsJsonSR.clsJsonSR = New clsJsonSR.clsJsonSR
        Dim conexion As New Mok.SqlConexion(ConfigurationManager.ConnectionStrings("MOKO").ConnectionString)
        Dim tablaSitios As DataTable
        Dim parametros As Mok.SqlParametros = New Mok.SqlParametros

        tablaSitios = conexion.GetDataTable("select distinct lo.SitioCod, SitioNombre, SitioAmbiente   from Mok2.sesion.IntSitio si inner join Gestion.Log lo on lo.sitioCod = si.SitioCod  where SitioVigente = 1")
        Return (Serializar.listaParaCombobox(True, tablaSitios, Nothing))

    End Function
    <System.Web.Script.Services.ScriptMethod(ResponseFormat:=ResponseFormat.Json)> _
  <System.Web.Services.WebMethod(True)> _
    Public Function LogGraficoCodigoErrorPorFecha(ByVal logFechaDesde As String, _
                        ByVal logFechaHasta As String, _
                        ByVal sitioCod As Integer, _
                        ByVal error1 As String, _
                        ByVal error2 As String, _
                        ByVal error3 As String) As String


        Dim Serializar As clsJsonSR.clsJsonSR = New clsJsonSR.clsJsonSR
        Dim conexion As New Mok.SqlConexion(ConfigurationManager.ConnectionStrings("Liquidacion").ConnectionString)
        Dim dsLog As DataSet
        Dim tabalaGrupos As DataTable
        Dim tablaDatosGrupo As DataTable
        Dim parametros As Mok.SqlParametros = New Mok.SqlParametros
        parametros.Add("@logFechaDesde", logFechaDesde, Data.SqlDbType.Date)
        parametros.Add("@logFechaHasta", logFechaHasta, Data.SqlDbType.Date)
        parametros.Add("@error1", error1, Data.SqlDbType.Text)
        parametros.Add("@error2", error2, Data.SqlDbType.Text)
        parametros.Add("@error3", error3, Data.SqlDbType.Text)
        parametros.Add("@SitioCod", sitioCod, Data.SqlDbType.Int)
        dsLog = conexion.GetDataSet("pa_obtieneCodigoErrorPorFechaLog", CommandType.StoredProcedure, parametros)
        Dim jsonGrafico As String = ""
        If (dsLog.Tables.Count > 0) Then
            tabalaGrupos = dsLog.Tables(0)
            tablaDatosGrupo = dsLog.Tables(1)


            jsonGrafico = "["
            Dim cantidadGrupos As Integer = tabalaGrupos.Rows.Count
            Dim i As Integer = 0
            For Each grupo In tabalaGrupos.Rows
                Dim nombreGrupo As String = grupo.item("grupo")
                jsonGrafico += "{""key"": """ & nombreGrupo & """,""values"": ["

                Dim cantidadPorGrupo As Integer = CInt(tablaDatosGrupo.Select("grupo = '" & nombreGrupo.ToString & "'").Count)

                Dim j As Integer = 0
                For Each elements In tablaDatosGrupo.Select("grupo = '" & nombreGrupo & "'")
                    j += 1

                    jsonGrafico += "[""" & elements.Item("x") & """," & elements.Item("y") & "]" & IIf(j = cantidadPorGrupo, "", ",")

                Next
                i += 1
                jsonGrafico += "]}" & IIf(i = cantidadGrupos, "", ",")

            Next
            jsonGrafico += "]"
        End If


        Return jsonGrafico

    End Function
    <System.Web.Script.Services.ScriptMethod(ResponseFormat:=ResponseFormat.Json)> _
<System.Web.Services.WebMethod(True)> _
    Public Function LogSitiosStatusFecha(ByVal logFechaDesde As String, _
                        ByVal logFechaHasta As String) As String
        Dim Serializar As clsJsonSR.clsJsonSR = New clsJsonSR.clsJsonSR
        Dim conexion As New Mok.SqlConexion(ConfigurationManager.ConnectionStrings("Liquidacion").ConnectionString)
        Dim tablaSitios As DataTable
        Dim parametros As Mok.SqlParametros = New Mok.SqlParametros
        parametros.Add("@logFechaDesde", logFechaDesde, Data.SqlDbType.Date)
        parametros.Add("@logFechaHasta", logFechaHasta, Data.SqlDbType.Date)
        tablaSitios = conexion.GetDataTable("pa_obtieneStatusSitios", CommandType.StoredProcedure, parametros)
        Return (Serializar.listaParaCombobox(True, tablaSitios, Nothing))

    End Function

    <System.Web.Script.Services.ScriptMethod(ResponseFormat:=ResponseFormat.Json)> _
<System.Web.Services.WebMethod(True)> _
    Public Function LogErroesTipo() As String
        Dim Serializar As clsJsonSR.clsJsonSR = New clsJsonSR.clsJsonSR
        Dim conexion As New Mok.SqlConexion(ConfigurationManager.ConnectionStrings("Liquidacion").ConnectionString)
        Dim tablaErroresTipo As DataTable
        tablaErroresTipo = conexion.GetDataTable("[pa_obtieneErroresTipo]", CommandType.StoredProcedure)
        Return (Serializar.listaParaCombobox(True, tablaErroresTipo, Nothing))

    End Function



    <WebMethod()> _
    Public Function LogXML(ByVal logIp As String, _
                        ByVal logNombreUsuario As String, _
                        ByVal logErrorNro As String, _
                        ByVal logErrorMsg As String, _
                        ByVal logErrorInternoMsg As String, _
                        ByVal logArchivoFuente As String, _
                        ByVal logMetodo As String, _
                        ByVal logVersionSistema As String, _
                        ByVal sitioCod As Integer) As Data.DataTable

        Dim conexion As New Mok.SqlConexion(ConfigurationManager.ConnectionStrings("Liquidacion").ConnectionString)
        Dim tablaLog As DataTable
        Dim parametros As Mok.SqlParametros = New Mok.SqlParametros
        parametros.Add("@logIp", logIp, Data.SqlDbType.Text)
        parametros.Add("@logNombreUsuario", logNombreUsuario, Data.SqlDbType.Text)
        parametros.Add("@logErrorNro", logErrorNro, Data.SqlDbType.Text)
        parametros.Add("@logErrorMsg", logErrorMsg, Data.SqlDbType.Text)
        parametros.Add("@logErrorInternoMsg", logErrorInternoMsg, Data.SqlDbType.Text)
        parametros.Add("@logArchivoFuente", logArchivoFuente, Data.SqlDbType.Text)
        parametros.Add("@logMetodo", logMetodo, Data.SqlDbType.Text)
        parametros.Add("@logVersionSistema", logVersionSistema, Data.SqlDbType.Text)
        parametros.Add("@SitioCod", sitioCod, Data.SqlDbType.Int)
        tablaLog = conexion.GetDataTable("pa_insertaLog", CommandType.StoredProcedure, parametros)
        tablaLog.TableName = "Log"
        Return tablaLog

    End Function

End Class
