import React, { useState } from "react";
import LeftLinks from "./leftlinks.tsx";
import RightContent from "./rightlinks.tsx";
import { menuData } from '../utils/UserDetails.ts';

function FirstPage() {
    const [selectedContent, setSelectedContent] = useState<string>('Manage');

    const handleLinkClick = (content: string) => {
        setSelectedContent(content);
    };

    return (
        <div className="content">
            <div className="header">
            <h1>Epic Intelligence</h1>
            </div>
            <div className="main">
                <div className="left-div">
                    <LeftLinks handleLinkClick={handleLinkClick} selectedContent={selectedContent} />
                </div>
                <div className="right-div">
                    <RightContent selectedContent={selectedContent} />
                </div>

            </div>
        </div>
    );
}
export default FirstPage;