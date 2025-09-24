import React from 'react'
import { image } from '../../components/assets/assets'

export default function WhatappChatView({ htmlContent, isLoading = false }) {

    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour clock
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${hours}:${formattedMinutes} ${ampm}`;
    }

    return (
        <div className="input-field">
            <div className="message-prv candidate-boxscroll">
                {isLoading && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                        <i className="material-icons" style={{ fontSize: '24px', marginRight: '8px' }}>hourglass_empty</i>
                        Loading WhatsApp template...
                    </div>
                )}
                {htmlContent && !isLoading && (
                    <div className="whatsapp-message-wr">
                        <img src={image.WhatsAppImage} alt="" />
                        <div className="whatsapp-container">
                            <section className="chat-wraper">
                                <div className="chat-main" dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
                                <div className="date-chat">{getCurrentTime()}</div>
                            </section>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
