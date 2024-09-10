import React, { useRef, useState, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { faPlus, faTimes, faEllipsisVertical, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import * as xlsx from 'xlsx';
import { useDownloadExcel } from 'react-export-table-to-excel';
type RightPanelProps = {
    selectedContent: string;
};
const RightPanel: React.FC<RightPanelProps> = ({ selectedContent }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    // const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const usertypes = ["User", "Admin"];
    const usergroups = ["Tarento", "Data Team", "Guest"];
    const companies = ["Google", "Microsoft", "Enmasse"];
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof Employee, boolean>>>({});
    const [searchTerm, setSearchTerm] = useState<string>('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [searchButtonClicked, setSearchButtonClicked] = useState<boolean>(false);
    const tableRef = useRef(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({

        key: null,  // Initial key for sorting

        direction: 'ascending',  // Initial direction for sorting

    });

    const [showSorted, setShowSorted] = useState<boolean>(false);
    const [employeeDetails, setEmployeeDetails] = useState<Employee[]>([]);
    const [formData, setFormData] = useState<Employee>({
        company: '',
        name: "",
        usertype: '',
        email_id: '',
        usergroup: ''
    });

    interface Employee {
        company: string;
        name: string;
        email_id: string,
        usertype: string,
        usergroup: string,
    }
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        if (!isSidebarOpen) {
            setEditMode(false);
            setEditIndex(null);
            setFormData({
                company: '',
                name: '',
                email_id: '',
                usertype: '',
                usergroup: ""
            });
        }
    };
    const [formValid, setFormValid] = useState({
        company: false,
        name: false,
        email_id: false,
        usertype: false,
        usergroup: false
    });
    interface FormData {
        company: string;
        name: string;
        usertype: string;
        email_id: string;
        usergroup: string;
    }
    interface SortConfig {

        key: keyof Employee | null;

        direction: 'ascending' | 'descending';

    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,

            [name]: value

        });

        setTouchedFields({
            ...touchedFields,
            [name]: true

        });

        validateInput(name as keyof FormData, value);

    };
    const handleSettingChange = (event: ChangeEvent<HTMLSelectElement>) => {

        const name = event.target.name;

        const value = event.target.value;

        setFormData({
            ...formData,

            [name]: value

        });
        setTouchedFields({
            ...touchedFields,
            [name]: true

        });
        validateInput(name as keyof FormData, value);



    };
    const validateInput = (name: keyof FormData, value: string) => {

        switch (name) {
            case 'company':
                setFormValid({

                    ...formValid,

                    company: true

                });

                break;
            case 'name':
                setFormValid({

                    ...formValid,

                    name: true

                });

                break;

            case 'email_id':

                setFormValid({

                    ...formValid,

                    email_id: emailRegex.test(value)

                });

                break;
            case 'usertype':
                setFormValid({

                    ...formValid,

                    usertype: true

                });

                break;
            case 'usergroup':
                setFormValid({

                    ...formValid,

                    usergroup: true

                });

                break;




            default:

                setFormValid({

                    ...formValid,

                    [name]: value.trim() !== ''

                });

        }

    };
    const handleAddEmployee = () => {

        if (editMode && editIndex !== null) {

            const updatedEmployees = [...employeeDetails];

            updatedEmployees[editIndex] = {

                company: formData.company,
                name: formData.name,
                email_id: formData.email_id,
                usertype: formData.usertype,
                usergroup: formData.usergroup

            };

            setEmployeeDetails(updatedEmployees);

            setEditMode(false);

            setEditIndex(null);

            setIsSidebarOpen(false);

        } else {

            const newEmployee = {
                company: formData.company,
                name: formData.name,
                email_id: formData.email_id,
                usertype: formData.usertype,
                usergroup: formData.usergroup

            };

            if (Object.values(formValid).every(Boolean)) {

                setEmployeeDetails([...employeeDetails, newEmployee]);

                setIsSidebarOpen(false);

            }

        }

        setFormData({
            company: '',
            name: '',
            email_id: '',
            usertype: "",
            usergroup: ""

        });

    };

    const handleEdit = (index: number) => {
        setFormData({

            company: employeeDetails[index].company,
            name: employeeDetails[index].name,
            email_id: employeeDetails[index].email_id,
            usertype: employeeDetails[index].usertype,
            usergroup: employeeDetails[index].usergroup
        });
        setEditMode(true);
        setEditIndex(index);
        setIsSidebarOpen(true);
    };

    const handleDelete = (index: number) => {
        const updatedEmployees = [...employeeDetails];
        updatedEmployees.splice(index, 1);
        setEmployeeDetails(updatedEmployees);
        setDeleteIndex(null);
    };
    const togglemenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: 'Users table',
        sheet: 'Users'
    })

    const getContent = () => {

        switch (selectedContent) {

            case 'User':

                return (
                    <div className="table-container">


                        <label >User </label>
                        <span>
                            <div id="search-container" className='searchbutton'>

                                <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} />

                            </div>
                            <span className='Invitebutton'>
                                <FontAwesomeIcon icon={faPlus} id='font-icon' onClick={toggleSidebar} />
                                {/* <button className="invite" >Invite</button> */}
                            </span>


                        </span>
                        <label htmlFor="upload">Upload File</label>
                        <input
                            type="file"
                            name="upload"
                            id="upload"
                            onChange={readUploadFile}
                        />

                        <button onClick={onDownload}> Export excel </button>

                        <div >

                            <table className="table-data" ref={tableRef}>

                                <thead >

                                    <tr className="table-header">
                                        <th>

                                            <div className="d-flex flex-row align-items-center">

                                                Company

                                                <div className="d-flex flex-column ">

                                                    <IoMdArrowDropup

                                                        onClick={() => requestSort('company')}

                                                        style={{ pointerEvents: sortConfig.key === 'company' && sortConfig.direction === 'descending' ? 'none' : 'auto', opacity: sortConfig.key === 'company' && sortConfig.direction === 'descending' ? 0.5 : 1, fontSize: '25px ' }}

                                                    />

                                                    <IoMdArrowDropdown

                                                        onClick={() => requestSort('company')}

                                                        style={{ pointerEvents: sortConfig.key === 'company' && sortConfig.direction === 'ascending' ? 'none' : 'auto', opacity: sortConfig.key === 'company' && sortConfig.direction === 'ascending' ? 0.5 : 1, fontSize: '25px ' }}

                                                    />

                                                </div>

                                            </div>



                                        </th>
                                        <th>

                                            <div className="d-flex flex-row align-items-center">

                                                Name

                                                <div className="d-flex flex-column ">

                                                    <IoMdArrowDropup

                                                        onClick={() => requestSort('name')}

                                                        style={{ pointerEvents: sortConfig.key === 'name' && sortConfig.direction === 'descending' ? 'none' : 'auto', opacity: sortConfig.key === 'name' && sortConfig.direction === 'descending' ? 0.5 : 1, fontSize: '25px ' }}

                                                    />

                                                    <IoMdArrowDropdown

                                                        onClick={() => requestSort('name')}

                                                        style={{ pointerEvents: sortConfig.key === 'name' && sortConfig.direction === 'ascending' ? 'none' : 'auto', opacity: sortConfig.key === 'name' && sortConfig.direction === 'ascending' ? 0.5 : 1, fontSize: '25px ' }}

                                                    />

                                                </div>

                                            </div>



                                        </th>



                                        <th>

                                            <div className="d-flex flex-row align-items-center">

                                                Email ID

                                                <div className="d-flex flex-column ">

                                                    <IoMdArrowDropup onClick={() => requestSort('email_id')}

                                                        style={{ pointerEvents: sortConfig.key === 'email_id' && sortConfig.direction === 'descending' ? 'none' : 'auto', opacity: sortConfig.key === 'email_id' && sortConfig.direction === 'descending' ? 0.5 : 1, fontSize: '25px' }}

                                                    />

                                                    <IoMdArrowDropdown onClick={() => requestSort('email_id')}

                                                        style={{ pointerEvents: sortConfig.key === 'email_id' && sortConfig.direction === 'ascending' ? 'none' : 'auto', opacity: sortConfig.key === 'email_id' && sortConfig.direction === 'ascending' ? 0.5 : 1, fontSize: '25px ' }}

                                                    />

                                                </div>

                                            </div>

                                        </th>
                                        <th>

                                            <div className="d-flex flex-row align-items-center">

                                                User Type

                                                <div className="d-flex flex-column ">

                                                    <IoMdArrowDropup

                                                        onClick={() => requestSort('usertype')}

                                                        style={{ pointerEvents: sortConfig.key === 'usertype' && sortConfig.direction === 'descending' ? 'none' : 'auto', opacity: sortConfig.key === 'usertype' && sortConfig.direction === 'descending' ? 0.5 : 1, fontSize: '25px ' }}

                                                    />

                                                    <IoMdArrowDropdown

                                                        onClick={() => requestSort('usertype')}

                                                        style={{ pointerEvents: sortConfig.key === 'usertype' && sortConfig.direction === 'ascending' ? 'none' : 'auto', opacity: sortConfig.key === 'usertype' && sortConfig.direction === 'ascending' ? 0.5 : 1, fontSize: '25px ' }}

                                                    />

                                                </div>

                                            </div>



                                        </th>
                                        <th>

                                            <div className="d-flex flex-row align-items-center">

                                                User Group

                                                <div className="d-flex flex-column ">

                                                    <IoMdArrowDropup

                                                        onClick={() => requestSort('usergroup')}

                                                        style={{ pointerEvents: sortConfig.key === 'usergroup' && sortConfig.direction === 'descending' ? 'none' : 'auto', opacity: sortConfig.key === 'usergroup' && sortConfig.direction === 'descending' ? 0.5 : 1, fontSize: '25px ' }}

                                                    />

                                                    <IoMdArrowDropdown

                                                        onClick={() => requestSort('usergroup')}

                                                        style={{ pointerEvents: sortConfig.key === 'usergroup' && sortConfig.direction === 'ascending' ? 'none' : 'auto', opacity: sortConfig.key === 'usergroup' && sortConfig.direction === 'ascending' ? 0.5 : 1, fontSize: '25px ' }}

                                                    />

                                                </div>

                                            </div>



                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {showSorted ? sortedData.map((employee, index) => (

                                        <tr key={index}>

                                            <td>{employee.company}</td>
                                            <td>{employee.name}</td>
                                            <td>{employee.email_id}</td>
                                            <td>{employee.usertype}</td>
                                            <td>{employee.usergroup}</td>
                                            <td>
                                                <button onClick={() => handleEdit(index)}>
                                                    <FontAwesomeIcon icon={faEdit} />
                              
                                                </button>
                                                <button onClick={() => handleDelete(index)}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </td>



                                        </tr>

                                    )) :

                                        (searchTerm == '') ? employeeDetails.map((employee, index) => (

                                            <tr key={index}>

                                                <td>{employee.company}</td>
                                                <td>{employee.name}</td>
                                                <td>{employee.email_id}</td>
                                                <td>{employee.usertype}</td>
                                                <td>{employee.usergroup}</td>
                                                <td>
                                                    <button onClick={() => handleEdit(index)}>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <button onClick={() => handleDelete(index)}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </td>
                                                {/* <td><FontAwesomeIcon icon={faEllipsisVertical} onClick={togglemenu} /></td> */}

                                            </tr>

                                        )) :

                                            (searchButtonClicked === true && searchTerm !== '' && filteredEmployees.length !== 0) ? filteredEmployees.map((employee, index) => (

                                                <tr key={index}>
                                                    <td>{employee.company}</td>
                                                    <td>{employee.name}</td>
                                                    <td>{employee.email_id}</td>
                                                    <td>{employee.usertype}</td>
                                                    <td>{employee.usergroup}</td>
                                                    <td>
                                                        
                                                        <button onClick={() => handleEdit(index)}>
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                        <button onClick={() => handleDelete(index)}>
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </td>
                                                    {/* <td><FontAwesomeIcon icon={faEllipsisVertical} onClick={togglemenu} /></td> */}


                                                </tr>

                                            )) : <tr>

                                                <td colSpan={6} style={{ textAlign: 'center' }}>No data found!</td>

                                            </tr>}

                                </tbody>



                            </table>

                        </div>




                    </div>

                );
        }
    }
    const readUploadFile = (e) => {
        e.preventDefault();
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log(e);
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);
                console.log(json);
                setEmployeeDetails(json);
                console.log(employeeDetails);
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }
    }

    const sortedData = React.useMemo(() => {

        if (sortConfig.key) {

            const sorted = [...employeeDetails].sort((a, b) => {

                const aValue = a[sortConfig.key as keyof Employee];

                const bValue = b[sortConfig.key as keyof Employee];



                if (sortConfig.direction === 'ascending') {

                    if (typeof aValue === 'string' && typeof bValue === 'string') {

                        return aValue.localeCompare(bValue);

                    }

                }

                if (sortConfig.direction === 'descending') {

                    if (typeof aValue === 'string' && typeof bValue === 'string') {

                        return bValue.localeCompare(aValue);

                    }

                }

                return 0;

            });

            setShowSorted(true);

            return sorted;

        }

        return employeeDetails;

    }, [employeeDetails, sortConfig]);





    const requestSort = (key: keyof Employee) => {

        let direction: 'ascending' | 'descending' = 'ascending';

        if (sortConfig.key === key && sortConfig.direction === 'ascending') {

            direction = 'descending';

        }

        setSortConfig({ key, direction });

    };
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e) {

            setSearchTerm(e.target.value);

            const searchResults = employeeDetails.filter((employee) =>

                Object.values(employee).some((value) =>

                    value.toLowerCase().includes(searchTerm.toLowerCase())

                )

            );

            /*if(searchResults!==null){
      
            setFilteredEmployees(searchResults);
      
            }*/

            setFilteredEmployees(searchResults);

            setSearchButtonClicked(true);

        }

        else {

            setSearchTerm('');

            setSearchButtonClicked(false);

        }

    };

    return (

        <div className="right-div">
            {getContent()}
            {isSidebarOpen && (

                <div className="sidebar">

                    <div className="sidebar-header">

                        <h2>Employee Details</h2>

                        <FontAwesomeIcon icon={faTimes} className="cancel-icon" onClick={toggleSidebar} />

                    </div>

                    <form>
                        <label>
                            Company :
                            <select className="Dropdown" name='company' value={formData.company} onChange={handleSettingChange}>

                                {companies.map((company, index) => (

                                    <option key={index} value={company}>
                                        {company}
                                    </option>

                                ))}

                            </select>
                        </label>



                        <label>

                            Name :

                            <br />

                            <input type="text" name="name" className="input" value={formData.name} placeholder="Enter name" onChange={handleInputChange} />

                        </label>
                        <label>

                            Email ID :

                            <input type="email" name="email_id" value={formData.email_id} className={`input ${touchedFields.email_id && !formValid.email_id ? 'error' : ''}`} placeholder="Enter email" onChange={handleInputChange}></input>

                            <br />

                            {touchedFields.email_id && !formValid.email_id && <span className="error-message">Enter with a valid format (e.g: xyz@gmail.com) </span>}

                        </label>
                        <label>
                            UserType :
                            <select className="Dropdown" name='usertype' value={formData.usertype} onChange={handleSettingChange}>

                                {usertypes.map((usertype, index) => (

                                    <option key={index} value={usertype}>

                                        {usertype}

                                    </option>

                                ))}

                            </select>
                        </label>
                        <label>
                            User Group :
                            <select className="Dropdown" name='usergroup' value={formData.usergroup} onChange={handleSettingChange}>

                                {usergroups.map((usergroup, index) => (

                                    <option key={index} value={usergroup}>

                                        {usergroup}

                                    </option>

                                ))}

                            </select>
                        </label>

                        <button type="button" className="btn btn-primary" onClick={handleAddEmployee} disabled={!Object.values(formValid).every(Boolean)}>Add</button>

                    </form>

                </div>

            )}

        </div>

    );

}

export default RightPanel;