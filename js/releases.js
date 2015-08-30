"use strict";

function requestFail() {
	$("#latest-release").html("<p>Sorry, we can't fetch this data right now. :(</p>");
}

function requestJSON(url, callback) {
	$.ajax({
		url: url,
		complete: function(xhr) {
			callback.call(null, xhr.responseJSON);
		},
		error: requestFail
	});
}

function compareAssets(a, b) {
	if (a.label < b.label)
		return -1;
	if (a.label > b.label)
		return 1;
	return 0;
}

function fillReleaseInfo(json) {
	var html = "";
	// title
	html += "<h2>Latest Release: ";
	html += "<a href=\""+json.html_url+"\">";
	html += json.name;
	html += "</a>";
	if(json.prerelease) {
		html += "<span class=\"rel-testing\">Testing</span>";
	}
	else {
		html += "<span class=\"rel-stable\">Stable</span>";
	}
	html += "</h2>";
	// release notes
	html += "<a href=\"#\" id=\"toggle-rel-notes\">Show Full Release Notes</a>";
	html += "<div style=\"overflow: hidden\" id=\"rel-notes\">";
	html += micromarkdown.parse(json.body, true);
	html += "</div>";
	// download assets
	// first sort them into alphabetical order
	json.assets.sort(compareAssets);
	html += "<ul class=\"rel-assets\">";
	for(var i in json.assets) {
		html += "<li>";
		html += "<a href=\""+json.assets[i].browser_download_url+"\">";
		html += json.assets[i].label;
		html += "</a>";
		html += "</li>";
	}
	html += "</ul>";

	$("#latest-release").html(html);

	var relNotesHeightCompact = 150;
	var relNotesHeightFull = $('#rel-notes').height();
	// only show the compact version of release notes if they exceed the
	// compact length
	if(relNotesHeightCompact >= relNotesHeightFull) {
		$("#toggle-rel-notes").hide();
	}
	else {
		$('#rel-notes').height(relNotesHeightCompact);

		$("#toggle-rel-notes").click(function() {
			if($('#rel-notes').height() == relNotesHeightCompact) {
				$("#rel-notes").animate({height: relNotesHeightFull}, 200);
			}
			else {
				$("#rel-notes").animate({height: relNotesHeightCompact}, 200);
			}
		});
	}
}

$(document).ready(function() {
	var requri = 'https://api.github.com/repos/TauLabs/TauLabs/releases/latest';
    requestJSON(requri, function(json) {
    	if(json.message == "Not Found") {
    		requestFail();
    	}
    	else {
    		fillReleaseInfo(json);
    	}
    });
});
