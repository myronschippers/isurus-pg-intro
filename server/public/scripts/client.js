$(document).ready(init);

function init() {
    console.log('Hello Isurus!!!');
    console.log('Would you like to play with some Code?');

    // event listeners
    $('.s-add-song-btn').on('click', clickAddNewSong);
    $('.js-songs-list').on('click', '.js-btn-delete', clickDeleteSong);
    $('.js-songs-list').on('click', '.js-btn-published-edit', clickPublishedEdit);
    $('.js-songs-list').on('click', '.js-btn-published-save', clickPublishedSave);

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

function clickPublishedEdit(event) {
    const $parentElement = $(this).parent();
    const $btnEdit = $parentElement.children('.js-btn-published-edit');
    const $btnSave = $parentElement.children('.js-btn-published-save');
    const $publishedText = $parentElement.children('.js-published-text');
    const $publishedInput = $parentElement.children('.js-published-input');
    const hideClass = 'hide';

    // static ui not editable
    $btnEdit.toggleClass(hideClass);
    $publishedText.toggleClass(hideClass);
    // interactive ui is editable
    $btnSave.toggleClass(hideClass);
    $publishedInput.toggleClass(hideClass);
}

function clickPublishedSave(event) {
    const $parentElement = $(this).parent();
    const $publishedInput = $parentElement.children('.js-published-input');
    const publishedDate = $publishedInput.val();
    const saveBtnData = $(this).data();
    console.log($(this));
    const songId = saveBtnData.id;

    console.log('publishedDate: ', publishedDate);
    console.log('songId: ', songId);
    putSongPublished(publishedDate, songId);
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

function putSongPublished(publishedDate, songId) {
    const serverPutObject = {
        published: publishedDate,
    };

    $.ajax({
        type: 'PUT',
        url: `/api/songs/published/${songId}`,
        data: serverPutObject,
    })
    .then(function(serverResponse) {
        getSongs();
    })
    .catch(function(err) {
        console.log('Error updating song: ', err);
        alert('There was an Error updating your song.');
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
                    <div>
                        published on: <span class="js-published-text">${song.published}</span>
                        <input type="text" placeholder="Published" class="js-published-input hide" />
                        <button class="js-btn-published-edit btn">Update</button>
                        <button
                            class="js-btn-published-save btn hide"
                            data-id="${song.id}"
                        >
                            Save
                        </button>
                    </div> 
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