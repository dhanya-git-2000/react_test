import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import {menuData} from '../utils/UserDetails.ts'


type LeftPanelProps = {
    handleLinkClick: (content: string) => void;
    selectedContent: string;
};

const LeftPanel: React.FC<LeftPanelProps> = ({ handleLinkClick, selectedContent }) => {
    const handleClick = (content: string) => {
        handleLinkClick(content);
        
    }
    

    return (
        <div className="left-div">
            <span className='menu' >
                <FontAwesomeIcon icon={faUserGroup} id='font-icon'/>
                {/* <div>
                <MenuComponent items={menu} fields={menuFields}/>
                </div> */}

                
                <button onClick={() => handleClick("User")} id="link-button" className={selectedContent === 'User' ? 'active' : 'inactive'}>User</button>
            </span>
        </div>
    );
}

export default LeftPanel;