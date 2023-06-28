import React from 'react';
import axios from 'axios';
import './AnimationsList.css';
import {Dropdown} from 'react-bootstrap';
import {BottomScrollListener} from 'react-bottom-scroll-listener';

class AnimationsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            list: [],
            page: 1,
            sortBy: ''
        };

        this.fetchData = this.fetchData.bind(this);
        this.dataList = this.dataList.bind(this);
        this.onSelectSortBy = this.onSelectSortBy.bind(this);
        this.pageIncrement = this.pageIncrement.bind(this);
    }

    fetchData() {
        const sortQuery = this.state.sortBy ? `&sortby=${this.state.sortBy}` : '';
        const url = `https://kodoumo.ir/wp-json/api/v2/reviews-category/animations?page=${this.state.page}${sortQuery}`;
        axios.get(url).then(response => {
            if (response.status === 200 && response.statusText === 'OK') {
                this.setState({list: response.data.data})
            }
        });
    }

    onSelectSortBy(selected) {
        this.setState({sortBy: selected});
        this.fetchData();
    }

    dataList(data) {
        const dataList = data.map((item, index) => {
            let rateClass = item.reviewsRate ? 'fa-star' : 'fa-star-o';

            return (
                <div className='col-6 animation-box' key={index}>
                    <img src={item.reviewsThumbnailUrl} alt={item.reviewsTitle} className='anim-cover'/>
                    <h6 className='anim-title'>{item.reviewsTitle}</h6>
                    <span>
                        <i className={'review-rate fa ' + rateClass}/>
                        {item.reviewsRate}
                    </span>
                </div>
            );
        });

        return <div className="row">{dataList}</div>;
    }

    pageIncrement() {
        this.setState((state, prop) => {
            return {page: state.page + 1};
        });

        console.log(this.state.page);
        this.fetchData();
    }


    render() {
        if (this.state.list.length === 0) {
            return false;
        }

        return (
            <BottomScrollListener onBottom={() => this.pageIncrement()}>
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 d-flex flex-row-reverse">
                            <Dropdown className='sort-dropdown' onSelect={(selected) => this.onSelectSortBy(selected)}>
                                <Dropdown.Toggle variant="light" id="dropdown-basic">
                                    <i className='fa fa-sort'/>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="view">View</Dropdown.Item>
                                    <Dropdown.Item eventKey="rate">Rate</Dropdown.Item>
                                    <Dropdown.Item eventKey="newest">Newest</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    <div data-page-number={this.state.page}>
                        {this.dataList(this.state.list)}
                    </div>
                    <div data-page-number={this.state.page}>
                        {this.state.page > 1 && this.dataList(this.state.list)}
                    </div>
                </div>
            </BottomScrollListener>
        );
    }

    componentDidMount() {
        this.fetchData();
    }
}

export default AnimationsList;