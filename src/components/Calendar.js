import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
require("react-big-calendar/lib/css/react-big-calendar.css");

BigCalendar.momentLocalizer(moment);

class Calendar extends Component {
    constructor() {
        super()
        this.state = {
            events: [{
                title: "Current Day",
                start: new Date(),
                end: new Date(),
                desc: "It always have an appointment on the current day"
            }
            ],
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

    //Allows user to click on calendar slot
    handleSlotSelected(slotInfo) {
        // console.log(slotInfo)
        // var startDate = moment(slotInfo.start.toLocaleString('en-US')).format("MMMM Do YYYY, h:mm:ss a");
        // var endDate = moment(slotInfo.end.toLocaleString('en-US')).format("MMMM Do YYYY, h:mm:ss a");
        console.log(slotInfo)
        console.log(this.state.events)
        let hasEvent = this.state.events.some(event => event['start'] === slotInfo.start);
        console.log(hasEvent)
        if (hasEvent) {
            return alert("Appointment exists")
        }
        this.setState({
            openSlot: true,
            start: slotInfo.start,
            end: slotInfo.end
        });
        // console.log('startTime', this.state.start);
        // console.log('endTime', this.state.end);
    }

    handleEventSelected(event) {
        console.log("event", event) //Shows the event details provided while booking
        this.setState({
            openEvent: true,
            clickedEvent: event,
            selectedEventTitle: event.title,
            selectedEventDescription: event.desc,
            selectedEventStart: event.start
        })
        console.log(this.state.selectedEventTitle)

    }

    setTitle(e) {
        this.setState({ title: e })
    }

    setDescription(e) {
        this.setState({ desc: e })
    }

    setAppointment() {
        // console.log("Fired")
        const { start, end, title, desc } = this.state;
        let appointment = {
            title,
            start,
            end,
            desc
        }
        this.setState({ events: this.state.events.push(appointment) })
        // console.log("appointment set", this.state.events)
    }

    updateEvent() {
        const index = this.state.events.findIndex(event => event === this.state.clickedEvent)
        console.log("index", index);
        const newArr = this.state.events.slice();
        newArr[index].title = this.state.title;
        newArr[index].desc = this.state.desc;
        console.log("updated Event",newArr,)
        console.log("Spliced event", this.state.events.splice(index, 1, newArr))
        this.setState({
            events: newArr
        })
    }

    deleteEvent() {
        //  filters out specific event that is to be deleted and set to a variable
        let updatedEvents = this.state.events.filter(event=> event["start"] !== this.state.selectedEventStart);
        this.setState({events: updatedEvents})
    }

    render() {
        console.log("render()")
        const eventActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Delete"
                primary={true}
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
                primary={false}
                onClick={this.handleClose}
                
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onClick={() => { this.setAppointment(), this.handleClose() }}
            />,
        ];
        return (
            <div id="Calendar">
                <BigCalendar
                    events={this.state.events}
                    views={["month", "week", "day"]}
                    timeslots={2}
                    defaultView='month'
                    defaultDate={new Date()}
                    selectable={true}
                    onSelectEvent={event => this.handleEventSelected(event)}
                    onSelectSlot={(slotInfo) => this.handleSlotSelected(slotInfo)}
                />

                {/* Modal for booking new appointment */}
                <Dialog
                    title={`Book an appointment on ${this.state.start}`}
                    actions={appointmentActions}
                    modal={false}
                    open={this.state.openSlot}
                    onRequestClose={this.handleClose}
                >
                    <TextField
                        hintText="Title"
                        onChange={e => { this.setTitle(e.target.value) }}
                    />
                    <br />
                    <TextField
                        hintText="Description"
                        onChange={e => { this.setDescription(e.target.value) }}
                    />
                </Dialog>

                {/* Modal for Existing Event */}
                <Dialog
                    title={`View/Edit Appointment on ${this.state.selectedEventStart}`}
                    actions={eventActions}
                    modal={false}
                    open={this.state.openEvent}
                    onRequestClose={this.handleClose}
                >
                    <TextField
                        defaultValue={this.state.selectedEventTitle}
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