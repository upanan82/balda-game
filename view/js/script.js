'use strict';

var str = '',
	boo = 0,
	who = 1,
	lastID = 0,
	list = [],
	listID = [];

	$(document).ready(function() {
		$('.inp').attr('maxlength', '1').prop('disabled', true);
		$(".inp").change(function() {
			$(".inp").prop('readonly', true);
			$("#none").prop('disabled', false);
			lastID = this.id;
			boo = 1;
		});
		$('.inp').click(function() {
			if (boo == 1) {
				if (!$(this).val()) return false;
				if (listID.length > 0) $('#ok').prop('disabled', false);
				str += $(this).val();
				$("#newWord").val(str);
				listID.push(this.id);
				$(this).css({'border-color':'orange'});
			}
		});
		$('.inp').hover(function() {
			if (boo == 1) $(this).addClass("hover");
		}, function() {
    		$(this).removeClass("hover");
		});
	});

	function newGame() {
		var result = $('#new').val();
		if (!/^([а-яё]{5})$/i.test(result)) mess('The start word is not entered correctly!');
		else {
		    var data = {'word' : result.toLowerCase()};
		    ajaxFunc(data, function(data) {
                if (data == 'OK') {
                    $('.mess').html('');
                    clearFunc(true, true);
                    list.push(result.toUpperCase());
			        var letters = result.toUpperCase().split('');
			        for (var i = 0; i < letters.length; i++)
			            $('#i3-' + (i + 1)).val(letters[i]).prop('readonly', true);
			        $('.inp').prop('disabled', false);
			        $('#p' + who).css({'color':'orange'});
                }
                else mess("This word does not exist!");
            });
		}
	}

	function clearFunc(x, y) {
	    if (x == true) {
	        $('#p2').css({'color':'#777'});
	        $('.inp').val('').prop('readonly', false);
		    $('ul').html('');
		    $('#points1').html(0);
		    $('#points2').html(0);
		    list = [];
		    who = 1;
		    lastID = 0;
	    }
	    else {
	        var k = 0;
	        $("td > .inp").each( function(index, element) {
			    if ($(element).val() == '') {
			        $(element).prop('readonly', false);
			        k++;
			    }
		    });
		    if (k == 0) {
		        if (Number($('#points1').html()) > Number($('#points1').html())) mess('Player 1 WIN!');
			else if (Number($('#points1').html()) == Number($('#points1').html())) mess('It`s a DRAW!');
		        else  mess('Player 2 WIN!');
		    }
		    if (y != false) $('#' + lastID).val('').prop('readonly', false);
		    $('#newWord').val('');
	    }
		$('#none').prop('disabled', true);
		$('#ok').prop('disabled', true);
		str = '';
		boo = 0;
		listID = [];
		$('.inp').css({'border-color':'initial'});
	}
	function error() {
		mess('Invalid selection of letters!');
    	clearFunc(false, true);
	}

	function change() {
		for (var i = 0; i < listID.length - 1; i++) {
			var x = listID[i].substr(1).split('-'),
				y = listID[i + 1].substr(1).split('-');
			for (var j = i + 1; j < listID.length; j++)
				if (listID[i] == listID[j]) {
					error();
					return false;
				}
			if (x[0] == y[0]) {
				if (Number(x[1]) + 1 != y[1] && Number(x[1]) - 1 != y[1]) {
				    error();
					return false;
				}
			} 
			else if (x[1] == y[1]) {
				if (Number(y[0]) + 1 != x[0] && Number(y[0]) - 1 != x[0]) {
					error();
					return false;
				}
			}
			else {
				error();
				return false;
			}
		}
		newKey();
	}

	function newKey() {
		var point = Number($('#points' + who).html()),
			word = $('#words' + who).html();
		for (var i = 0; i < list.length; i++)
			if (list[i] == $('#newWord').val().toUpperCase()) {
				mess('This word has already been used!');
				clearFunc(false, true);
				return false;
			}
		var z = false;
		for (var j = 0; j < listID.length; j++) {
			if (listID[j] == lastID) {
			    j = listID.length;
			    z = true;
			}
		}
		if (z != true) {
			mess('The letter you typed is not used!');
			clearFunc(false, true);
			return false;
		}
		var data = {'word' : $('#newWord').val().toLowerCase()};
		ajaxFunc(data, function(data) {
            if (data == 'OK') {
                $('.mess').html('');
                list.push($('#newWord').val().toUpperCase());
		        point += listID.length;
		        word += '<li>' + $('#newWord').val().toUpperCase() + '</li>';
		        $('#points' + who).html(point);
		        $('#words' + who).html(word);
		        $('#p'+ who).css({'color':'#777'});
		        if (who == 1) who = 2;
		        else who = 1;
		        $('#p' + who).css({'color':'orange'});
		        clearFunc(false, false);
            }
            else {
                mess("This word does not exist!");
                clearFunc(false, true);
            }
        });
	}

	function ajaxFunc(data, callback) {
	    $('.mess').html('Loading ...');
	    $('body').prop('disabled', true);
		$.ajax({
	        type: 'POST',
	        data: JSON.stringify(data),
		    contentType: 'application/json',
            url: '/word',						
            success: callback
		});
	}
			
	function mess(data) {
	    $('.mess').html(data);
	}
