import React from "react";
import ProductListHeader from "components/ProductListHeader";
import ProductItem from "components/ProductItem";
import CategoryList from "components/CategoryList";
import axios from "utils/axios";
import PopupEditor from "components/PopupEditor";
import AddProduct from "components/AddProduct";

/*
  - State for the whole product display --> unfiltered or filtered
  - When unfiltered we display everything as usual
  - When filtered we need to only display the specified products 
  - For state change, we can use a ternary condition to check state
*/

//ProductList component
class ProductList extends React.Component {
  //product list state
  state = {
    // stores the current search results
    products: [],
    // stores the entire product list from database
    originalProducts: [],
    productAds: [],
    cartAmount: 0,
    filter: "none",
    filteredProducts: []
  };


  //fetch data from server
  componentDidMount() {
    axios.get("http://localhost:3001/ads?userID=70").then((res) => {
      this.setState({
        productAds: res.data.slice(0, 4),
      });
    });

    axios.get("http://localhost:3001/products").then((res) => {
      this.setState({
        products: res.data,
        originalProducts: res.data,
      });
    });

    
  }

  //search for a product
  search = (searchText) => {
    //get new product list array
    let search_products = [...this.state.originalProducts];
    //filter new array
    search_products = search_products.filter((product) => {
      // not case sensitive, search by product name
      const result = product.prodName.match(new RegExp(searchText, "gi"));
      return !!result;
    });
    //set state of product
    this.setState({
      products: search_products,
    });
  };

  //open popup editor
  addProduct = () => {
    PopupEditor.open({
      component: AddProduct,
      callback: data => {
        //when the data is not empty, add new data to a list of products
        console.log(data)
        if (data) {
          this.add(data);
        }
        console.log("Product Data:", data); //test
      },
    });
  };

  //add product method 
  add = product => {
    const _products = [...this.state.products];
    _products.push(product);
    const _sProducts = [...this.state.originalProducts];
    _sProducts.push(product);

    this.setState({
      products: _products,
      originalProducts: _sProducts
    });
  };
  // Handle callback to retrieve state from CategoryList component
  handleCategory(data){
    this.setState({
      filter:data
    });
  }

  // Make call to backend and render the products 
  renderFilteredProducts(filter){
    // Use prop categoryName to send the current category name 
    axios.get(`http://localhost:3001/filter-products/?category=${filter}`).then((response)=>{
      // Returns JSON in web console
      console.log(response.data);
    });
  }

  render() {
    return (
      <div>
        {/* pass search function to productList Header (contains search button) */}
        <ProductListHeader search={this.search} />
        <CategoryList callback={this.handleCategory.bind(this)}/>

        {/* START HERE FOR STATE CHANGE */}
        {this.state.filter == 'none'?
        <div className="products-container">
          <button
            className="button is-danger popup-btn"
            onClick={this.addProduct}
          >
            + Add Product +
          </button>
          {/* each line has 12 slots */}
          <div className="columns is-multiline is-desktop">

            {/* iterate through the advertisements */}
            {this.state.productAds.map((ad) => {
              return (
                // each column is 3 slots, thus 4 products per line
                <div className="column is-3" key={ad.id}>
                  <h1>Promoted</h1>
                  <ProductItem product={ad} />
                </div>
              );
            })}

            {/* iterate through all products */}
            {this.state.products.map((product) => {
              return (
                // each column is 3 slots, thus 4 products per line
                <div className="column is-3" key={product.id}>
                  <ProductItem product={product} />
                </div>
              );
            })}
          </div>
        </div>
        :
        <>
        {this.renderFilteredProducts(this.state.filter)}
        {/* iterate through all products */}
        {/*this.state.products.map((product) => {
              return (
                // each column is 3 slots, thus 4 products per line
                <div className="column is-3" key={product.id}>
                  <ProductItem product={product} />
                </div>
              );
            })*/}
        </>
          }
        {/* END HERE FOR STATE CHANGE */}
      </div>
    );
  }
}

export default ProductList;
