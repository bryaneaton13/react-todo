/** @jsx React.DOM */
/* https://github.com/reactjs/sublime-react */
var React = require('react');


// Test data to create the cards with
var cards = [
    {value: "Card 1"},
    {value: "Card 2"}
];

// Create the card that will be used to edit or add the item
var EditCard = React.createClass({
    
    // Stop the submit and then pass the ID and value to the outside function
    handleSubmit: function(e) {
        e.preventDefault();
        this.props.handleSubmit(
            this.props.id,
            this.refs.card.getDOMNode().value
        );
    },
    // Each time the component is created, select the text in it
    componentDidMount: function() {
        this.refs.card.getDOMNode().select();
    },
    // create the form to edit the card
    render: function() {
        var className = "editCard";
        if (this.props.value !== '')
            className += " zoomIn animated";
        return (
            <div className={className}>
                <form
                    className="form-group"
                    onSubmit={this.handleSubmit}>
                    <input
                        className="form-control" 
                        type="text"
                        defaultValue={this.props.value}
                        ref="card" />
                    <div className="pull-right btn-group">
                        <button
                            type="button"
                            onClick={this.props.onCancel}
                            className="btn btn-default">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        );
    }
});

// Create the item based on whether or not it is editable
var CardListItem = React.createClass({

    // Grab the initial state based on the properties
    getInitialState: function() {
        return {
            edit: this.props.edit
        }
    },

    // Make the card editable
    edit: function() {
        if (!this.state.edit)
            this.props.toggleEdit(this.props.id);
    },

    // Cancel the update
    cancelUpdate: function() {
        this.props.toggleEdit(this.props.id);
    },
    // Each time the props are recreated, grab the new edit state
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            edit: nextProps.edit
        });
    },

    render: function() {
        var item = <a href="javascript:void(0)">{this.props.value}</a>;

        // If editable, create and EditCard
        if (this.state.edit) {
            item = <EditCard
                        id={this.props.id}
                        handleSubmit={this.props.handleSubmit}
                        onCancel={this.cancelUpdate}
                        value={this.props.value} />
        }

        return (     
            <li 
                onClick={this.edit}
                className="list-group-item fadeInLeft animated">
                {item}
            </li>
        );
    }
});

var CardList = React.createClass({

    handleSubmit: function(id, val) {
        this.props.editCard(id, val);
    },
    toggleEdit: function(id) {
        this.props.toggleEdit(id);
    },

    render: function() {
        // Create CardListItems for every card in the array
        var cards = this.props.cards.map(function(c, id) {
            return (
                <CardListItem
                    key={id}
                    id={id}
                    edit={c.edit}
                    toggleEdit={this.toggleEdit}
                    handleSubmit={this.handleSubmit}
                    value={c.value} />                    
            );
        }.bind(this));
        return (     
            <ul 
                className="list-group">
                {cards}
            </ul>
        );
    }
});

// Show the card list and an add button
var CardsAdd = React.createClass({

    // Add an id and a false edit value to each card initially
    getInitialState: function() {
        var cards = this.props.cards.map(function(c, index) {
            return {
                id: index,
                value: c.value,
                edit: false
            };
        });
        return {
            cards: cards
        }
    },
    // Add a new editable card with a blank value
    addCard: function() {
        var cards = this.state.cards;
        cards.push({
            value: '',
            edit: true
        });
        this.setState({
            cards: cards
        });
    },
    // Edit the value of a card
    editCard: function(id, val) {
        var cards = this.state.cards;

        if (val === '') {
            cards.splice(id, 1);
        }
        else {
            cards[id].value = val;
            cards[id].edit = false;            
        }
        this.setState({
            cards: cards
        });
    },
    // Change the edit value of the card
    toggleEdit: function(id) {
        var cards = this.state.cards;
        if (cards[id].value === '') {
            cards.splice(id, 1);
        }
        else {
            cards[id].edit = !cards[id].edit;            
        }
        this.setState({
            cards: cards
        });
    },
    render: function() {

        return (     
            <div className="cardList">
                <CardList 
                    toggleEdit={this.toggleEdit}
                    editCard={this.editCard}
                    cards={this.state.cards}/>
                <div className="listButton">
                    <button
                        className="btn btn-default"
                        type="button"
                        onClick={this.addCard}>
                        Add Card
                    </button>
                </div>
            </div>
        );
    }
});


React.render(<CardsAdd cards={cards} />, document.body);