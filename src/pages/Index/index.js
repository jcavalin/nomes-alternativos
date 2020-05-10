import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import './styles.css';

import api from '../../services/api';

function Index() {
    const [next, setNext] = useState(null);
    const [names, setNames] = useState([]);
    
    let searchTimeout = null;

    const fetchData = search => {
        let normalizeSearch = search => search.toUpperCase()
                                              .normalize("NFD")
                                              .replace(/[\u0300-\u036f]/g, ""); 

        search = search ? `?first_name=${normalizeSearch(search)}` : ''; 
    
        api.get(`nomes/data/${search}`).then(response => {
            setNext(response.data.next);
            setNames(response.data.results)
        });
    }
    
    
    const fetchNext = () => {
        if(!next) {
            return;
        }

        axios.get(next).then(response => {
            setNext(response.data.next);
            setNames([...names, ...response.data.results]);
        })
    }

    const capitalize = name => 
        (name || '').charAt(0).toUpperCase() + name.toLowerCase().slice(1);

    const formatName = name => 
        (name || '').split('|').map(capitalize).join(' ');

    const handleChange = event => {
        let { value } = event.currentTarget;

        if(searchTimeout) {
            clearTimeout(searchTimeout);
        }

        searchTimeout = setTimeout(() => fetchData(value), 1000);
    };
    
    useEffect(fetchData, []);

    return (
        <div className="index-container">
            <div className="search">
                <input type="text" placeholder="Pesquise um nome" onChange={handleChange}  />
                <small>
                    Fonte: IBGE/Censo 2010, dados tratados por 
                    Álvaro Justen/<a href="https://brasil.io">Brasil.IO</a>.
                </small>
            </div>
            <section className="list">
                <ul>
                <InfiniteScroll
                    dataLength={names.length} 
                    next={fetchNext}
                    hasMore={true}
                    loader={<h4>Carregando...</h4>}
                    height="100%"
                    >
                    {names.map(name => (
                        <li key={name.first_name}>
                            <h3>{capitalize(name.first_name)}</h3>
                            
                            <strong>Alternativas</strong>
                            <p>
                                {formatName(name.alternative_names)}
                            </p>
                        </li>
                    ))}
                </InfiniteScroll>
                </ul>
            </section>
        </div>
    );
}

export default Index;