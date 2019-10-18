import React, { Component } from 'react'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';
import { Link, NavLink } from 'react-router-dom' 
    

export default class Header extends Component {
    state = {
        isOpen: false
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    logOut = (e) => {
      e.preventDefault()
      sessionStorage.clear()
      window.location.href = '/'
    }

    render() {
        return (
          <div>
            <Navbar color="dark" dark expand="md">
              <NavbarBrand href="#!">EDS API/GraphQL demonstration</NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar> 
                  <NavItem>
                    <NavLink className="nav-link" activeStyle={{ color: '#007BFF' }} to="/statistics">Statistics</NavLink>    
                  </NavItem>  
                  <NavItem>
                    <NavLink className="nav-link" activeStyle={{ color: '#007BFF' }} to="/browse">Browse</NavLink>    
                  </NavItem> 
                </Nav>
              </Collapse>
            </Navbar>
          </div>
        );
      }
}            