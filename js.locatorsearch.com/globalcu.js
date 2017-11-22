// JavaScript Document
var searchString = document.location.search;
var iFrameUrl ='' ;
var street = '' ;
var city = '' ;
var state = '' ;
var zipcode = '' ;
var addressline= '' ;
var locationid = '' ;

// strip off the leading '?'
searchString = searchString.substring(1);

var nvPairs = searchString.split("&");

for (i = 0; i < nvPairs.length; i++)
{
     var nvPair = nvPairs[i].split("=");
     var name = nvPair[0];
     var value = nvPair[1];
	 
	 if (nvPair[0] == "street")
	 {
		street = nvPair[1] ;	 
	 }
	 if (nvPair[0] == "city")
	 {
		city = nvPair[1] ;	 
	 }
	 if (nvPair[0] == "state")
	 {
		state = nvPair[1] ;	 
	 }
	 if (nvPair[0] == "pagam4")
	 {
		if (nvPair[1] != "Zip+Code...")
		{
			zipcode = nvPair[1] ;	 
		}
		else
		{
			zipcode = '' ;
		}
	 }	 
	 if (nvPair[0] == "param5")
	 {
		iFrameUrl = iFrameUrl + '&ATMSF=1' ;	 
	 }
	 if (nvPair[0] == "ATMSF")
	 {
		iFrameUrl = iFrameUrl + '&ATMSF=1' ;	 
	 }
	 if (nvPair[0] == "ATMDP")
	 {
		iFrameUrl = iFrameUrl + '&ATMDP=1' ;	 
	 }
	 if (nvPair[0] == "FCSATM")
	 {
		iFrameUrl = iFrameUrl + '&FCSATM=1' ;	 
	 }
	 if (nvPair[0] == "FCS")
	 {
		iFrameUrl = iFrameUrl + '&FCS=1' ;	 
	 }
	 if (nvPair[0] == "ESC")
	 {
		iFrameUrl = iFrameUrl + '&ESC=1' ;	 
	 }
	 if (nvPair[0] == "FSCESC")
	 {
		iFrameUrl = iFrameUrl + '&FSCESC=1' ;	 
	 }
	 if (nvPair[0] == "param7")
	 {
		iFrameUrl = iFrameUrl + '&FCS=1' ;	 
	 }
	 if (nvPair[0] == "locationid")
	 {
	 		locationid = nvPair[1] ;	
	 }
}
if (street.length > 0)
 {
    addressline = street ;
 }	 
 if (city.length > 0)
 {
    if (addressline.length > 0)
    {
        addressline = addressline + "," + city ;
    }
    else
    {
        addressline = city ;
    }
 }
 if (state.length > 0)
 {
    if (addressline.length > 0)
    {
        addressline = addressline + "," + state ;
    }
    else
    {
        addressline = state ;
    }
 }
 if (zipcode.length > 0)
 {
    if (addressline.length > 0)
    {
        addressline = addressline + "," + zipcode ;
    }
    else
    {
        addressline = zipcode ;
    }
 }

if (addressline.length > 0)
{
 iFrameUrl = 'addTXT=' + addressline.replace(' ','+') + iFrameUrl ;
}
else
{
 iFrameUrl = '';
}
if(locationid.length > 0)
{
	document.write('<iframe id="atmlocator" src="https://globalcu.locatorsearch.com/ATMBranchDtls.aspx?locationid=' + locationid + '" height="725" width="100%" name="atmlocator" frameborder="0" allowtransparency="true" scrolling="no">Your browser doesn\'t support iframes</iframe>');
}
else
{ 
	if (iFrameUrl.length > 0)
	{
		document.write('<iframe id="atmlocator" src="https://globalcu.locatorsearch.com/index.aspx?' + iFrameUrl + '" height="725" width="100%" name="atmlocator" frameborder="0" allowtransparency="true" scrolling="no">Your browser doesn\'t support iframes</iframe>');
	}
	else
	{
		document.write('<iframe id="atmlocator" src="https://globalcu.locatorsearch.com/index.aspx?s=FCS" height="725" width="100%" name="atmlocator" frameborder="0" allowtransparency="true" scrolling="no">Your browser doesn\'t support iframes</iframe>');
	}
}

document.write('<table cellSpacing="0" cellPadding="0" width="725" align="center" border="0"><tr><td align="center"><a href="http://www.locatorsearch.com" target="_blank"><img src="https://images.locatorsearch.com/locatorsearch.gif" border="0"></a></td></tr></table>')



