import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import swal from 'sweetalert';
require("react-big-calendar/lib/css/react-big-calendar.css");

BigCalendar.momentLocalizer(moment);

class Calendar extends Component {
    constructor() {
        super()
        this.state = {
            events: [],
            title: "",
            start: "",
            end: "",
            desc: "",
            openSlot: false,
            openEvent: false,
            clickedEvent: {},
            selectedEventTitle: "",
            selectedEventDescription: "",
            selectedEventStart: ""
        }
        this.handleClose = this.handleClose.bind(this);
    }

    //  After creating a new appointment and adding it to event array, Array gets converted to a single number datatype by unforseen action which breaks code.
    //  This lifecycle converts it back to original array before rendering is triggered.
    componentWillUpdate(nextProps, nextState) {
        // console.log( "Component will update", nextState.events, this.state.events)
        if (typeof nextState.events !== 'object' || nextState.events.constructor !== Array) {
            nextState.events = this.state.events;
        }
    }

    //closes modals
    handleClose() {
        this.setState({ openEvent: false, openSlot: false });
    }

    //  Allows user to click on calendar slot and handles if appointment exists
    handleSlotSelected(slotInfo) {
        // console.log(slotInfo)
        var startDate = moment(slotInfo.start.toLocaleString('en-US')).format("MMMM DD YYYY");
        var endDate = moment(slotInfo.end.toLocaleString('en-US')).format("MMMM DD YYYY");
        this.setState({title:"", desc:""});
        console.log("slotInfo", startDate)
        console.log("events", this.state.events)
        if(this.state.events.filter(e => e.start == startDate && e.end ==endDate).length > 0) {
            swal("Appointment already exists!", "Click on appointment to view/edit event.")
        } else
        this.setState({
            openSlot: true,
            start: slotInfo.start,
            end: slotInfo.end
        });
    }

    handleEventSelected(event) {
        // console.log("event", event) 
        this.setState({
            openEvent: true,
            clickedEvent: event,
            selectedEventTitle: event.title,
            selectedEventDescription: event.desc,
            selectedEventStart: event.start
        })
    }

    setTitle(e) {
        this.setState({ title: e })
    }

    setDescription(e) {
        this.setState({ desc: e })
    }

    // Onclick callback function that pushes new appointment into events array.
    setNewAppointment() {
        // console.log("Fired")
        const { start, end, title, desc } = this.state;
        let appointment = {
            title,
            start: moment(start.toLocaleString("en-US")).format("MMMM DD YYYY"),
            end:  moment(end.toLocaleString("en-US")).format("MMMM DD YYYY"),
            desc
        }
        this.setState({ events: this.state.events.push(appointment) })
        // console.log("appointment set", this.state.events)
    }

    //  Updates Existing Appointments Title and/or Description
    updateEvent() {
        const index = this.state.events.findIndex(event => event === this.state.clickedEvent)
        const updatedEvent = this.state.events.slice();
        updatedEvent[index].title = this.state.title;
        updatedEvent[index].desc = this.state.desc;
        this.setState({
            events: updatedEvent
        })
    }

    //  filters out specific event that is to be deleted and set that variable to state
    deleteEvent() {
        let updatedEvents = this.state.events.filter(event=> event["start"] !== this.state.selectedEventStart);
        this.setState({events: updatedEvents})
    }

    render() {
        console.log("render()")
        const eventActions = [
            <FlatButton
                label="Cancel"
                primary={false}
                keyboardFocused={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Delete"
                secondary={true}
                keyboardFocused={true}
                onClick={() => {this.deleteEvent(),this.handleClose()}}
            />,
            <FlatButton
                label="Confirm Edit"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleClose}
                onClick={() => {this.updateEvent(), this.handleClose()}}
            />
        ];
        const appointmentActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onClick={this.handleClose}
                
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onClick={() => { this.setNewAppointment(), this.handleClose() }}
            />,
        ];
        return (
            <div id="Calendar">
            {/* react-big-calendar library utilized to render calendar*/}
                <BigCalendar
                    events={this.state.events}
                    views={["month", "week", "day"]}
                    timeslots={2}
                    defaultView='month'
                    defaultDate={new Date()}
                    selectable={'ignoreEvents'}
                    onSelectEvent={event => this.handleEventSelected(event)}
                    onSelectSlot={(slotInfo) => this.handleSlotSelected(slotInfo)}
                />

                {/* Material-ui Modal for booking new appointment */}
                <Dialog
                    title={`Book an appointment on ${moment(this.state.start).format("MMMM Do YYYY")}`}
                    actions={appointmentActions}
                    modal={false}
                    open={this.state.openSlot}
                    onRequestClose={this.handleClose}
                >
                    <TextField
                        hintText="Title"
                        errorText="This field is required."
                        onChange={e => { this.setTitle(e.target.value) }}
                    />
                    <br />
                    <TextField
                        hintText="Description"
                        onChange={e => { this.setDescription(e.target.value) }}
                    />
                </Dialog>

                {/* Material-ui Modal for Existing Event */}
                <Dialog
                    title={`View/Edit Appointment of ${moment(this.state.selectedEventStart).format("MMMM Do YYYY")}`}
                    actions={eventActions}
                    modal={false}
                    open={this.state.openEvent}
                    onRequestClose={this.handleClose}
                >
                    <TextField
                        defaultValue={this.state.selectedEventTitle}
                        errorText="This field is required"
                        onChange={e => { this.setTitle(e.target.value) }}
                    /><br />
                    <TextField
                        multiLine={true}
                        defaultValue={this.state.selectedEventDescription}
                        onChange={e => { this.setDescription(e.target.value) }}
                    />
                </Dialog>
            </div>
        )
    }
}

export default Calendar;