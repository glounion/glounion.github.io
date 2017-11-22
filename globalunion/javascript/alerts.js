$(function(){
	$('.alertClose').click(function(e){
		var this_row = $(this).data('alert_row');
		$('#alert_row'+this_row).remove();

		if($('.alert').length == 0){
			$('.alertWrapper').remove();
		}

		$.post(location.href, {action: 'close_alert',alert: $(this).prop('id')}, function(result){});
		e.preventDefault();
	});
});