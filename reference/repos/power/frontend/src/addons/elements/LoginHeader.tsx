import { Divider } from 'antd';
import React from 'react';

const config = {
    text: 'DIN DATA PARTNER',
    style: { fontSize: 32, fontWeight: 700, zIndex: 10000, color: '#75abf1', opacity: 1 },
};

const LoginHeader = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            { config.text ? (
                    <div style={config.style}>{config.text}</div>
                ):(
                    <img src="logo.png" alt="logo" style={{maxWidth: '100%'}}/>
                )
            }
            <div style={{ paddingTop: 16 }}></div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Login</div>
            <Divider />
        </div>

    );
};

export default LoginHeader;
