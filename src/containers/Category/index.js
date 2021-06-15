import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { addCategory, fetchAllCategory, updateCategories, deleteCategories as deleteCategoriesAction } from '../../actions/category'
import Input from '../../components/UI/Input/Input'
import Modal from '../../components/UI/Modal'
import CheckboxTree from 'react-checkbox-tree';
import {
    IoIosCheckboxOutline,
    IoIosCheckbox,
    IoIosArrowForward,
    IoIosArrowDown,
    IoIosAdd,
    IoIosTrash,
    IoIosCloudUpload
} from 'react-icons/io'
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import UpdateCategoriesModal from './Components/UpdataCategoriesModal'
import AddCategoryModal from './Components/AddCategoryModal'
import './style.css'
/**
 * @author
 * @function Category
**/

const Category = (props) => {
    const [show, setShow] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState('');
    const [categoryImage, setCategoryImage] = useState('');
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);
    const [checkedArray, setCheckedArray] = useState([]);
    const [expandedArray, setExpandedArray] = useState([]);
    const [updateCategoryModal, setUpdateCategoryModal] = useState(false);
    const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);
    const category = useSelector(state => state.category);
    const dispatch = useDispatch();



    const handleClose = () => {

        const form = new FormData();
        form.append('name', categoryName);
        form.append('parentId', parentCategoryId);
        form.append('categoryImage', categoryImage);
        dispatch(addCategory(form));
        setCategoryName('');
        setParentCategoryId('');
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    }

    const renderCategories = (categories) => {
        let mycategories = [];
        for (let category of categories) {
            mycategories.push(
                {
                    label: category.name,
                    value: category._id,
                    children: category.children.length > 0 && renderCategories(category.children),
                    type:category.type
                }
            )
        }
        return mycategories;
    }

    const createCategoryList = (categories, options = []) => {
        for (let category of categories) {
            options.push({ 
                value: category._id, 
                name: category.name, 
                parentId: category.parentId ,
                type:category.type
            });
            if (category.children.length > 0) {
                createCategoryList(category.children, options)
            }
        }
        return options;
    }
    const handleCategoryImage = (e) => {
        setCategoryImage(e.target.files[0]);
    }
    const updateCategory = () => {
        updateCheckedAndExpandedCategories();
        setUpdateCategoryModal(true);
    }

    const updateCheckedAndExpandedCategories = () => {
        const categories = createCategoryList(category.categories);
        const checkedArray = [];
        const expandedArray = [];
        checked.length > 0 && checked.forEach((categoryId, index) => {
            const category = categories.find((category, _index) => categoryId == category.value);
            category && checkedArray.push(category);
        })
        expanded.length > 0 && expanded.forEach((categoryId, index) => {
            const category = categories.find((category, _index) => categoryId == category.value);
            category && expandedArray.push(category);
        })
        setCheckedArray(checkedArray);
        setExpandedArray(expandedArray);
    }

    const handleCategoryInput = (key, value, index, type) => {
        console.log(value);
        if (type == "checked") {
            const updatedCheckedArray = checkedArray.map((item, _index) =>
                index == _index ? { ...item, [key]: value } : item);
            // console.log(checkedArray);
            setCheckedArray(updatedCheckedArray);
        } else if (type == "expanded") {
            const updatedExpandedArray = expandedArray.map((item, _index) =>
                index == _index ? { ...item, [key]: value } : item);
            setExpandedArray(updatedExpandedArray);
        }
    }

    const updateCategoriesForm = () => {
        const form = new FormData();
        expandedArray.forEach((item, index) => {
            form.append('_id', item.value);
            form.append('name', item.name);
            form.append('parentId', item.parentId ? item.parentId : "");
            form.append('type', item.type);
        });
        checkedArray.forEach((item, index) => {
            form.append('_id', item.value);
            form.append('name', item.name);
            form.append('parentId', item.parentId ? item.parentId : "");
            form.append('type', item.type);
        });
        dispatch(updateCategories(form));
        setUpdateCategoryModal(false);
    }
    const deleteCategory = () => {
        updateCheckedAndExpandedCategories();
        setDeleteCategoryModal(true);
    }

    const deleteCategories = () => {
        const checkedIdsArray = checkedArray.map((item, index) => ({ _id: item.value }));
        const expandedIdsArray = expandedArray.map((item, index) => ({ _id: item.value }));
        const idsArray = expandedIdsArray.concat(checkedIdsArray);
        // dispatch(deleteCategoriesAction(idsArray));

        if (checkedIdsArray.length > 0) {
            dispatch(deleteCategoriesAction(checkedIdsArray));
        }
        setDeleteCategoryModal(false);
    }

    const renderDeleteCategoryModal = () => {
        // console.log('delete',checkedArray);
        return (
            <Modal
                modalTitle="Confirm"
                show={deleteCategoryModal}
                handleClose={() => setDeleteCategoryModal(false)}
                buttons={[
                    {
                        label: 'No',
                        color: 'primary',
                        onClick: handleClose
                    },
                    {
                        label: 'Yes',
                        color: 'danger',
                        onClick: deleteCategories
                    }
                ]}
            >
                {/* <h5>Expanded</h5>
                { expandedArray.map((item, index) => <span key={index}>{item.name}</span>)} */}
                <h3>Items to be</h3>
                { checkedArray.map((item, index) => <li key={index}>{item.name}</li>)}
            </Modal>
        );
    }


    return (
        <Layout sidebar>
            <Container>
                <Row>
                    <Col md={12}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3>Category</h3>
                            {/* {console.log(show)} */}
                            <div className="actionBtnContainer">
                                <span>Actions</span>
                                <button onClick={handleShow}><IoIosAdd />Add</button>
                                <button onClick={deleteCategory}><IoIosTrash />Delete</button>
                                <button onClick={updateCategory}><IoIosCloudUpload />Edit</button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        {/* <ul>
                            {renderCategories(category.categories)}
                        </ul> */}
                        <CheckboxTree
                            nodes={renderCategories(category.categories)}
                            checked={checked}
                            expanded={expanded}
                            onCheck={checked => setChecked(checked)}
                            onExpand={expanded => setExpanded(expanded)}
                            icons={{
                                check: <IoIosCheckbox />,
                                uncheck: <IoIosCheckboxOutline />,
                                halfCheck: <IoIosCheckboxOutline />,
                                expandClose: <IoIosArrowForward />,
                                expandOpen: <IoIosArrowDown />
                            }}
                        />
                    </Col>
                </Row>
            </Container>
            <AddCategoryModal
                show={show}
                handleClose={handleClose}
                modalTitle={'Add New Categories'}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                parentCategoryId={setParentCategoryId}
                setParentCategoryId={setParentCategoryId}
                categoryList={createCategoryList(category.categories)}
                handleCategoryImage={handleCategoryImage}
            />
            <UpdateCategoriesModal
                show={updateCategoryModal}
                handleClose={updateCategoriesForm}
                modalTitle={'Update Categories'}
                size={'lg'}
                checkedArray={checkedArray}
                expandedArray={expandedArray}
                handleCategoryInput={handleCategoryInput}
                categoryList={createCategoryList(category.categories)}
            />
            {/* {renderUpdateCategoriesModal()} */}
            {renderDeleteCategoryModal()}
        </Layout>
    )
}

export default Category;
