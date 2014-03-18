<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="Chore_Schedule._default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:Button ID="btnBuild" runat="server" Text="Build Schedule" />
    </div>
    <div>
        <asp:GridView ID="gvSchedule" runat="server"></asp:GridView>
    </div>
    </form>
</body>
</html>
