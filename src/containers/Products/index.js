import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Container, Row, Col, Table } from "react-bootstrap";
import Input from "../../components/UI/Input/Input";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, deleteProductById } from "../../actions/product";
import Modal from "../../components/UI/Modal";
import "./style.css";
import { generatePublicURL } from "../../urlConfig";
import { getInitialData } from "../../actions";

const Products = (props) => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [ratings, setRatings] = useState("");
  const [saving, setSaving] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [productDetailModal, setProductDetailModal] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const category = useSelector((state) => state.category);
  const product = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const handleClose = () => {
    const form = new FormData();
    form.append("name", name);
    form.append("quantity", quantity);
    form.append("price", price);
    form.append("description", description);
    form.append("category", categoryId);
    form.append("mrp", mrp);
    form.append("ratings", ratings);
    form.append("saving", saving);
    console.log(productImages);
    for (let pic of productImages) {
      form.append("productImage", pic);
    }
    dispatch(addProduct(form)).then((result) => {
      dispatch(getInitialData());
    });
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const createCategoryList = (categories, options = []) => {
    for (let category of categories) {
      options.push({ value: category._id, name: category.name });
      if (category.children.length > 0) {
        createCategoryList(category.children, options);
      }
    }
    return options;
  };
  const handleProductImages = (e) => {
    setProductImages([...productImages, e.target.files[0]]);
  };
  // console.log(productImages);

  const renderProducts = () => {
    return (
      <Table style={{ fontSize: "12px" }} responsive="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            {/* <th>MRP</th> */}
            <th>Quantity</th>
            {/* <th>Savings</th> */}
            <th>Ratings</th>
            {/* <th>Description</th> */}
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {product.products.length > 0
            ? product.products.map((product, idx) => (
                <tr
                  onClick={() => showProductDetailsModal(product)}
                  key={product._id}
                >
                  <td>{idx}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  {/* <td>{product.mrp}</td> */}
                  <td>{product.quantity}</td>
                  {/* <td>{product.saving}</td> */}
                  <td>{product.ratings}</td>
                  {/* <td>{product.description}</td> */}
                  <td>{product.category.name}</td>
                  <td>
                    <button onClick={() => showProductDetailsModal(product)}>
                      info
                    </button>
                    <button
                      onClick={() => {
                        const payload = {
                          productId: product._id,
                        };
                        dispatch(deleteProductById(payload));
                      }}
                    >
                      del
                    </button>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </Table>
    );
  };

  const renderAddProductModal = () => {
    return (
      <Modal show={show} handleClose={handleClose} modalTitle={"Add Products"}>
        <Input
          label="Name"
          value={name}
          placeholder={"Product Name"}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Quantity"
          value={quantity}
          placeholder={"Quantity"}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <Input
          label="MRP"
          value={mrp}
          placeholder={"MRP"}
          onChange={(e) => setMrp(e.target.value)}
        />
        <Input
          label="Price"
          value={price}
          placeholder={"Price"}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Input
          label="Saving"
          value={saving}
          placeholder={"Saving"}
          onChange={(e) => setSaving(e.target.value)}
        />
        <Input
          label="Ratings"
          value={ratings}
          placeholder={"Ratings"}
          onChange={(e) => setRatings(e.target.value)}
        />

        <Input
          label="Description"
          value={description}
          placeholder={"Description"}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="form-control"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option>Select category</option>
          {createCategoryList(category.categories).map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        {productImages.length > 0
          ? productImages.map((pic, idx) => (
              <div key={idx}>{JSON.stringify(pic.name)}</div>
            ))
          : null}
        <input type="file" name="productImage" onChange={handleProductImages} />
      </Modal>
    );
  };

  const handleCloseProductDetailsModal = () => {
    setProductDetailModal(false);
  };

  const showProductDetailsModal = (product) => {
    setProductDetails(product);
    setProductDetailModal(true);
  };

  const renderProductDetailsModal = () => {
    return (
      <Modal
        show={productDetailModal}
        handleClose={handleCloseProductDetailsModal}
        modalTitle={"Product Details"}
        size="lg"
      >
        <Row>
          <Col>
            <label className="key">{productDetails?.name}</label>
            <p className="value">
              <strong>Price: </strong>₹{productDetails?.price}
            </p>
            MRP: ₹<span className="value mrpval">{productDetails?.mrp}</span>
            <p className="value">Saves ₹{productDetails?.saving}</p>
            <p className="value">Ratings {productDetails?.ratings}</p>
            <p className="value">{productDetails?.description}</p>
            <p className="value">Category {productDetails?.category.name}</p>
          </Col>
        </Row>
        <Row>
          <Col style={{ display: "flex" }}>
            {productDetails?.productImages.map((image) => (
              <div className="productImg">
                <img src={generatePublicURL(image.img)} />
              </div>
            ))}
          </Col>
        </Row>
      </Modal>
    );
  };

  return (
    <Layout sidebar>
      <Container>
        <Row>
          <Col md={12}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>Products</h3>
              <button onClick={handleShow}>Add</button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div>{renderProducts()}</div>
          </Col>
        </Row>
      </Container>
      {renderAddProductModal()}
      {renderProductDetailsModal()}
    </Layout>
  );
};

export default Products;
