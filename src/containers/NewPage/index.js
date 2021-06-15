import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/Layout'
import Input from '../../components/UI/Input/Input';
import Modal from '../../components/UI/Modal';
import linearCategories from '../../helpers/linearCategories'
import {createPage} from '../../actions'

const NewPage=(props)=> {
    const [createModal,setCreateModal]=useState(false);
    const [title,setTitle]=useState('');
    const [pageName,setPageName]=useState('');
    const category=useSelector(state=>state.category);
    const [categories,setCategories]=useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('');
    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();
    const page = useSelector(state => state.page);
    useEffect(()=>{
        // console.log('category',category);
        setCategories(linearCategories(category.categories));
    },[category]);
    // console.log(categoryId);
    // console.log(title);
    // console
    // console.log(categories);
    const onCategoryChange = (e) => {
        console.log(e.target.value);
        const category = categories.find(category => category.name == e.target.value);
        setCategoryId(category.value);
        // console.log(category);
        // setTitle(category.name);
        setType(category.type);
    }
    const handleBannerImages = (e) => {
        console.log(e);
        setBanners([...banners, e.target.files[0]]);
    }

    const handleProductImages = (e) => {
        console.log(e);
        setProducts([...products, e.target.files[0]]);
    }
    const submitPageForm = (e) => {
        //e.target.preventDefault();

        if(title === ""){
            alert('Title is required');
            setCreateModal(false);
            return;
        }
        console.log(e);
        const form = new FormData();
        form.append('title', title);
        form.append('description', desc);
        form.append('category', categoryId);
        form.append('type', type);
        banners.forEach((banner, index) => {
            form.append('banners', banner);
        });
        products.forEach((product, index) => {
            form.append('products', product);
        });
        // console.log({title,desc,categoryId,type,banners,products});
        dispatch(createPage(form));
        setCreateModal(false)
    }
    const renderCreatePageModal = () => {
        return (
            <Modal
                show={createModal}
                modalTitle={'Create New Page'}
                handleClose={submitPageForm }    
            >
                <Container>
                    <Row>
                        <Col>
                            <select
                                className="form-control"
                                value={categoryId}
                                onChange={(onCategoryChange)}
                            >
                                <option value="">select category</option>
                                {
                                    categories.map(cat =>
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    )
                                }
                            </select>
                            {/* <Input
                                // value={title}
                                // onChange={(e)=>setTitle(e.target.value)}
                                // placeholder={'Page Title'}
                                // type="select"
                            //     value={title}
                            //     onChange={onCategoryChange}
                            //     options={categories}
                            //     placeholder={'Select Category'}
                            // /> */}
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={'Page Title'}
                                className="form-control-sm"
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Input
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder={'Page Desc'}
                                className=""
                            />
                        </Col>
                    </Row>

                    {
                            banners.length > 0 ? 
                            banners.map((banner, index) => 
                                <Row key={index}>
                                    <Col>{banner.name}</Col>
                                </Row>
                            ) : null
                    }
                    <Row>
                        <Col>
                            <Input
                                className="form-control" 
                                type="file" 
                                name="banners"
                                onChange={handleBannerImages}
                            />
                        </Col>
                    </Row>
                    {
                            products.length > 0 ? 
                            products.map((product, index) => 
                                <Row key={index}>
                                    <Col>{product.name}</Col>
                                </Row>
                            ) : null
                        }
                    <Row>
                        <Col>
                            <Input 
                                className="form-control"
                                type="file" 
                                name="products"
                                onChange={handleProductImages}
                            />
                        </Col>
                    </Row> 
                </Container>
            </Modal>
        );
    }
    return (
        <Layout sidebar>
            {renderCreatePageModal()}
            <button onClick={()=>setCreateModal(true)}>Create Page</button>
        </Layout>
    )
}

export default NewPage
