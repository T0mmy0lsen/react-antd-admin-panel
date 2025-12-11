import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Card, Descriptions, Button, Space, Alert, Spin, Avatar, Typography } from 'antd';
import { UserOutlined, SafetyCertificateOutlined, KeyOutlined } from '@ant-design/icons';
import { useAzureAuth, AzureLoginButton } from 'react-antd-admin-panel/auth';
const { Title, Text } = Typography;
/**
 * Azure Auth Demo Page
 * Demonstrates the Azure AD authentication module
 */
export default function AzureAuthDemoPage() {
    const { isAuthenticated, isLoading, account, userName, userEmail, graphProfile, graphLoading, login, logout, getAccessToken, fetchGraphProfile, } = useAzureAuth();
    const handleGetToken = async () => {
        const token = await getAccessToken();
        if (token) {
            console.log('Access token (first 50 chars):', token.substring(0, 50) + '...');
            alert('Token retrieved! Check console for details.');
        }
        else {
            alert('Failed to get token');
        }
    };
    const handleFetchProfile = async () => {
        const profile = await fetchGraphProfile();
        if (profile) {
            console.log('Graph Profile:', profile);
        }
    };
    if (isLoading) {
        return (_jsx("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }, children: _jsx(Spin, { size: "large", tip: "Authenticating..." }) }));
    }
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsxs(Title, { level: 2, children: [_jsx(SafetyCertificateOutlined, { style: { marginRight: 8 } }), "Azure AD Authentication Demo"] }), _jsx(Alert, { type: "info", showIcon: true, style: { marginBottom: 24 }, message: "Azure AD Integration", description: _jsxs("span", { children: ["This page demonstrates the ", _jsx("code", { children: "react-antd-admin-panel/auth" }), " module. Configure your Azure AD app registration in the environment variables."] }) }), _jsx(Card, { title: "Authentication Status", style: { marginBottom: 24 }, children: _jsxs(Space, { direction: "vertical", size: "large", style: { width: '100%' }, children: [_jsxs("div", { children: [_jsx(Text, { strong: true, children: "Status: " }), isAuthenticated ? (_jsx(Text, { type: "success", children: "Authenticated " })) : (_jsx(Text, { type: "warning", children: "Not authenticated" }))] }), !isAuthenticated ? (_jsxs(Space, { children: [_jsx(AzureLoginButton, {}), _jsx(Button, { onClick: login, children: "Custom Login Button" })] })) : (_jsxs(Space, { children: [_jsx(AzureLoginButton, {}), _jsx(Button, { danger: true, onClick: logout, children: "Custom Logout" })] }))] }) }), isAuthenticated && account && (_jsxs(_Fragment, { children: [_jsx(Card, { title: "Account Information", style: { marginBottom: 24 }, children: _jsxs(Space, { align: "start", size: "large", children: [_jsx(Avatar, { size: 64, icon: _jsx(UserOutlined, {}) }), _jsxs(Descriptions, { column: 1, bordered: true, size: "small", children: [_jsx(Descriptions.Item, { label: "Name", children: userName || '-' }), _jsx(Descriptions.Item, { label: "Email", children: userEmail || '-' }), _jsx(Descriptions.Item, { label: "Username", children: account.username }), _jsx(Descriptions.Item, { label: "Tenant ID", children: account.tenantId }), _jsx(Descriptions.Item, { label: "Home Account ID", children: _jsx(Text, { copyable: true, style: { fontSize: 12 }, children: account.homeAccountId }) })] })] }) }), _jsx(Card, { title: "API Actions", style: { marginBottom: 24 }, children: _jsxs(Space, { children: [_jsx(Button, { icon: _jsx(KeyOutlined, {}), onClick: handleGetToken, children: "Get Access Token" }), _jsx(Button, { icon: _jsx(UserOutlined, {}), onClick: handleFetchProfile, loading: graphLoading, children: "Fetch Graph Profile" })] }) }), graphProfile && (_jsx(Card, { title: "Microsoft Graph Profile", children: _jsxs(Descriptions, { column: 2, bordered: true, size: "small", children: [_jsx(Descriptions.Item, { label: "Display Name", children: graphProfile.displayName }), _jsx(Descriptions.Item, { label: "Email", children: graphProfile.mail || '-' }), _jsx(Descriptions.Item, { label: "Job Title", children: graphProfile.jobTitle || '-' }), _jsx(Descriptions.Item, { label: "Department", children: graphProfile.department || '-' }), _jsx(Descriptions.Item, { label: "Office", children: graphProfile.officeLocation || '-' }), _jsx(Descriptions.Item, { label: "Phone", children: graphProfile.mobilePhone || '-' }), _jsx(Descriptions.Item, { label: "UPN", span: 2, children: graphProfile.userPrincipalName })] }) }))] })), _jsx(Card, { title: "Configuration", style: { marginTop: 24 }, children: _jsx(Alert, { type: "warning", message: "Environment Variables Required", description: _jsxs("ul", { style: { margin: 0, paddingLeft: 20 }, children: [_jsxs("li", { children: [_jsx("code", { children: "VITE_AZURE_CLIENT_ID" }), " - Azure AD App Client ID"] }), _jsxs("li", { children: [_jsx("code", { children: "VITE_AZURE_TENANT_ID" }), " - Azure AD Tenant ID"] }), _jsxs("li", { children: [_jsx("code", { children: "VITE_AZURE_REDIRECT_URI" }), " - Redirect URI (optional)"] })] }) }) })] }));
}
