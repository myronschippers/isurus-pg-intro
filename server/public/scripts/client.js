import { get } from "http";

$(document).ready(init);

function init() {
    console.log('Hello Isurus!!!');
    console.log('Would you like to play with some Code?');

    // event listeners
    $('.s-add-song-btn').on('click', clickAddNewSong);

    getSongs();
}

//
// EVENT HANDLERS
// ----------

function clickAddNewSong(event) {
    const newSongData = {};
    const $songInputs = $('.js-song-input');

    $songInputs.each(function(inputElement) {
        const songDataKey = $('');
    });


}

//
// API / Server connections
// ----------

function getSongs() {}

function postSong(songData) {
    $.ajax({
        type: 'POST',
        url: '/api/songs',
        data: songData,
    })
    .then(function(serverResponse) {
        getSongs();
    })
}

//
// DOM / View rendering
// ----------

function clearFields() {
    $('.js-song-input').val('');
}

function render (songsDataList) {
    const $songsList = $('.js-song-list')
}