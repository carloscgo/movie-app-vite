import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Nav, Form, InputGroup, Button } from 'react-bootstrap';
import Select from 'react-select';
import get from 'lodash/get';

import { routes, VITE_APP } from '../../utils/constants';
import { setStorage, getStorage } from '../../utils/services';

import Container from './styles';
import { ITEM } from './constants';
import { IProps } from './interface';

const genresStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    borderBottom: '1px solid var(--bs-gray-300)',
    color: state.isSelected ? 'white' : 'blue',
    padding: 10,
    width: '100%',
  }),
  control: () => ({
    width: 200,
    display: 'flex'
  }),
  singleValue: (provided: any, state: any) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  }
};

const limitStyles = {
  ...genresStyles,

  control: () => ({
    width: 100,
    display: 'flex'
  }),
};

const NavBar = ({ genres, onSearch }: IProps) => {
  const defaultLimit: any = {
    value: get(getStorage('search-limit'), 'value', 10),
    label: get(getStorage('search-limit'), 'label', 10),
  }
  const defaultGenre: any = {
    value: get(getStorage('search-genre'), 'value', ''),
    label: get(getStorage('search-genre'), 'label', 'Todos'),
  }
  const defaultTitle: any = getStorage('search-title') || ''

  const [menu, setMenu] = useState('')
  const [selectedGenre, setSelectedGenre] = useState(defaultGenre);
  const [selectedLimit, setSelectedLimit] = useState(defaultLimit);
  const [textSearch, setTextSearch] = useState(defaultTitle);

  const navigate = useNavigate()

  const onSearchMovies = () => {
    setStorage('search-title', textSearch)
    setStorage('search-genre', selectedGenre)
    setStorage('search-limit', selectedLimit)

    onSearch({
      genreId: selectedGenre.value,
      limit: selectedLimit.value,
      title: textSearch,
    })

    navigate(routes.home)
  }

  return (
    <Container fluid className='d-flex flex-wrap text-bg-dark'>
      <Link to={routes.home} className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none p-3">
        <i className="bi bi-camera-reels logo"></i>
        <div className="text-bold">{VITE_APP.APP_NAME}</div>
      </Link>

      <Nav className="col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
        {ITEM.map(item => (
          <Nav.Item key={item.route}>
            <Link
              to={item.route}
              onClick={() => setMenu(item.route)}
              className={`nav-link text-white px-2 ${item.active} ${menu === item.route ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon}`}></i> {item.title}
            </Link>
          </Nav.Item>
        ))}
      </Nav>

      <InputGroup size="sm" className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3 input-search">
        <Select
          defaultValue={selectedGenre}
          onChange={(e: any) => setSelectedGenre(e)}
          name="category"
          className="form-control"
          placeholder="Categoria"
          styles={genresStyles}
          isClearable={true}
          isSearchable={true}
          isLoading={genres.loading}
          options={genres.data}
        />

        <Form.Control type="search" placeholder="Titulo de Pelicula" defaultValue={textSearch} onInput={(e: any) => setTextSearch(e.target.value)} />

        <Select
          defaultValue={selectedLimit}
          onChange={(e: any) => setSelectedLimit(e)}
          name="limit"
          className="form-control"
          placeholder="Registros"
          styles={limitStyles}
          isSearchable={false}
          options={[10, 20, 50].map(limit => ({
            value: limit,
            label: limit
          }))}
        />

        <Button type="button" className="btn btn-light" onClick={() => onSearchMovies()}>
          <i className='bi bi-search-heart-fill'></i>
        </Button>
      </InputGroup>
    </Container>
  )
};

export default NavBar;
