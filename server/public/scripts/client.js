$(document).ready(init);

function init() {
    console.log('Hello Isurus!!!');
    console.log('Would you like to play with some Code?');

    // event listeners
    $('.s-add-song-btn').on('click', clickAddNewSong);
    $('.js-songs-list').on('click', '.js-btn-delete', clickDeleteSong);

    getSongs();
}

//
// EVENT HANDLERS
// ----------

function clickAddNewSong(event) {
    const newSongData = {};
    const $songInputs = $('.js-song-input');

    $songInputs.each(function(inputElement) {
        const elementDataKey = $(this).data().songKey;
        newSongData[elementDataKey] = $(this).val();
    });

    postSong(newSongData);
}

function clickDeleteSong(event) {
    const buttonDataObject = $(this).data();
    const songId = buttonDataObject.id;

    deleteSong(songId);
}

//
// API / Server connections
// ----------

function getSongs() {
    $.ajax({
        type: 'GET',
        url: '/api/songs',
    })
    .then(function(serverResponse) {
        render(serverResponse);
    })
    .catch(function(err) {
        console.log('Error getting songs: ', err);
        alert('There was an Error getting new songs.');
    });
}

function postSong(songData) {
    $.ajax({
        type: 'POST',
        url: '/api/songs',
        data: songData,
    })
    .then(function(serverResponse) {
        getSongs();
    })
    .catch(function(err) {
        console.log('Error posting song: ', err);
        alert('There was Error posting new song.');
    });
}

function deleteSong(id) {
    $.ajax({
        type: 'DELETE',
        url: `/api/songs/delete/${id}`,
    })
    .then(function(serverResponse) {
        getSongs();
    })
    .catch(function(err) {
        console.log('Error deleting song: ', err);
        alert('There was Error deleting a song.');
    });
}

//
// DOM / View rendering
// ----------

function clearFields() {
    $('.js-song-input').val('');
}

function render (songsDataList) {
    const $songsList = $('.js-songs-list');

    console.log(songsDataList);
    $songsList.empty();
    for (let song of songsDataList) {
        $songsList.append(`
            <li>
                <div class="songPill">
                    ${song.track},
                    <p>by: ${song.artist}</p> 
                    <p>published on: ${song.published}</p> 
                    <button
                        class="js-btn-delete btn"
                        data-id="${song.id}"
                        data-something="WORD"
                    >
                        Delete
                    </button>
                </div>
            </li>
        `);
    }
}