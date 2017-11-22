$(function(){

	//Make sure we are on the events view
	if($('#eventCategory').length > 0){
		$('select[name=category]').change(function(){
			var selected_category = $(this).val();
		
			if($('.eventItem').length > 0){
				$.each($('.eventItem'),function(){
					if(selected_category == ''){
						$(this).show();
					}else{
						var categories = $(this).data('categories');
						var cat_array = categories.split(',');
						
						if(jQuery.inArray(selected_category, cat_array) === -1){
							$(this).hide();
						}else{
							$(this).show();
						}
					}
				});
			}
		});
	}
});