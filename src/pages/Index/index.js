import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import './styles.css';

import api from '../../services/api';

function Index() {
    const [next, setNext] = useState(null);
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(false);

    let searchTimeout = null;

    const fetchData = search => {
        setLoading(true);
            
        let normalizeSearch = search => search.toUpperCase()
                                              .normalize("NFD")
                                              .replace(/[\u0300-\u036f]/g, ""); 

        search = search ? `?first_name=${normalizeSearch(search)}` : ''; 
    
        api.get(`nomes/data/${search}`).then(response => {
            let {next, results} = response.data;
            
            setNext(next);
            setNames(results);
            setLoading(false);
        });
    }
    
    const fetchNext = () => {
        if(!next) {
            return;
        }

        axios.get(next).then(response => {
            let {next, results} = response.data;
            
            setNext(next);
            setNames([...names, ...results]);
        })
    }

    const capitalize = name => 
        (name || '').charAt(0).toUpperCase() + name.toLowerCase().slice(1);

    const formatName = name => 
        (name || '-').split('|').map(capitalize).join(' ');

    const handleChange = event => {
        let { value } = event.currentTarget;

        if(searchTimeout) {
            clearTimeout(searchTimeout);
        }

        searchTimeout = setTimeout(() => fetchData(value), 1000);
    };

    const scrollToTop = () => window.scrollTo(0, 0);

    const showLoading = () => (
        <h3 className="loading">
            Carregando...
        </h3>
    );

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
                <div>
                    {loading ? showLoading() : ''}
                    
                    <h3 class='vazio' style={loading || names.length > 0 ? {display : 'none'} : {}}>
                        Nenhum nome encontrado.
                    </h3>
                </div>


                <div style={names.length === 0 ? {display : 'none'} : {}}>
                    <h3>Nomes</h3>

                    <ul>
                        <InfiniteScroll
                            dataLength={names.length} 
                            next={fetchNext}
                            hasMore={true}
                            loader={showLoading()}
                            >
                            {names.map(name => (
                                <li key={name.first_name}>
                                    <div className="nome">
                                        {capitalize(name.first_name)}
                                    </div>
                                    
                                    <div className="alternativas">
                                        <strong>Alternativas</strong>
                                        <div>
                                            {formatName(name.alternative_names)}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </InfiniteScroll>
                    </ul>
                </div>

                <button type="button" className="scroll-top" onClick={scrollToTop}>
                    Topo
                </button>
            </section>
        </div>
    );
}

export default Index;