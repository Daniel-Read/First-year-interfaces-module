
//import { createClient } from './node_modules/@supabase/supabase-js'

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'


// Create a single supabase client for interacting with your database
const supabase = createClient('https://auxynhlfhexbukqxylid.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1eHluaGxmaGV4YnVrcXh5bGlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzNzc3MTIsImV4cCI6MjAzMDk1MzcxMn0.bi-Lx6GDocvprnKThKegXaR1Pvyd-vdK8IIQf1a7RPU')

//postgres://postgres.auxynhlfhexbukqxylid:[YOUR-PASSWORD]@aws-0-eu-west-2.pooler.supabase.com:5432/postgres
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1eHluaGxmaGV4YnVrcXh5bGlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzNzc3MTIsImV4cCI6MjAzMDk1MzcxMn0.bi-Lx6GDocvprnKThKegXaR1Pvyd-vdK8IIQf1a7RPU

var title = document.getElementsByTagName("title")[0].innerHTML;

if (title == "People Search")
    {        
        document.getElementById("peoplesubmit").addEventListener("click", function () {
          event.preventDefault();
          PeopleSearch();
        });
        
    }
else if(title == "Vehicle Search")
    {        
        document.getElementById("vehiclesubmit").addEventListener("click", function () {
          event.preventDefault();
          VehicleSearch();
        });
    }
else if(title == "Add a Vehicle")
    {

        const { data, error } = await supabase
        .from('People')
        .select("PersonID, Name")
        .order("PersonID", { ascending: true })

        var result = "";
        var i = 0; 
        data.forEach(function (item) {
            result += "<option value="+item.PersonID+">"+item.Name+"</option>";
            i = item.PersonID;
            });
        i += 1;
        result += "<option value="+i+">Other</option>"
        document.getElementById("ddowner").innerHTML = result;

        document.getElementById("ddowner").addEventListener("click", function () {
            event.preventDefault();
            var dropdown = document.getElementById("ddowner");
            if (dropdown.options[dropdown.selectedIndex].text == "Other")
                DisplayAddPerson(false);
            else 
                DisplayAddPerson(true);
          });

        document.getElementById("addvehiclesubmit").addEventListener("click", function () {
            event.preventDefault();
            AddVehicle(i);
          });
    }


async function PeopleSearch()
    {
        var name = document.getElementById("name").value
        var number = document.getElementById("number").value



        if (name == "" && number == "")
            {
                const { data, error } = await supabase
                .from('People')
                .select('*')

                if (error == null)
                    displayperson(data);

            }
        else if (name != "" && number == "")
        {
            const { data, error } = await supabase
            .from('People')
            .select('*')
            .eq("Name", name)

            if (error == null)
                displayperson(data);
        }
        else if (name == "" && number != "")
            {
                const { data, error } = await supabase
                .from('People')
                .select('*')
                .eq("LicenseNumber", number)
    
                if (error == null)
                    displayperson(data);
            }
        else if (name != "" && number != "")
        {
            const { data, error } = await supabase
            .from('People')
            .select('*')
            .eq("Name", name, "LicenseNumber", number)

            if (error == null)
                displayperson(data);
        } 
    }

    function displayperson(data)
    {
        var result = "";
        data.forEach(function (item) {
        result += "<li class='result'> personid: "+ item.PersonID + "<br>name: " + item.Name + "<br>address: " + item.Address + "<br>dob: " + item.DOB + "<br>licensenumber: " + item.LicenseNumber + "<br>expirydate: " + item.ExpiryDate;
        });
        document.getElementById("results").innerHTML = result;


        document.getElementById("search_successfull").hidden = false;
    }


async function VehicleSearch()
{
    var number = document.getElementById("rego").value

    if (number == "")
        {
            const { data, error } = await supabase
            .from('Vehicles')
            .select('*')

            if (error == null)
                displayVehicle(data);

        }
    else if (number != "")
        {
            const { data, error } = await supabase
            .from('Vehicles')
            .select('*')
            .eq("VehicleID",number)

            if (error == null)
                displayVehicle(data);

        }

}


function displayVehicle(data)
{
    var result = "";
    data.forEach(function (item) {
    result += "<li class='result'> vehicleid: "+ item.VehicleID + "<br>make: " + item.Make + "<br>model: " + item.Model + "<br>colour: " + item.Colour + "<br>ownerid: " + item.OwnerID;
    });
    document.getElementById("results").innerHTML = result;



    document.getElementById("search_successfull").hidden = false;
}


async function AddVehicle(index)
{
    var number = document.getElementById("rego").value
    var make = document.getElementById("make").value
    var model = document.getElementById("model").value
    var colour = document.getElementById("colour").value

        
    var dropdown = document.getElementById("ddowner");
    owner = dropdown.options[dropdown.selectedIndex].text;
        
    if (owner == "Other")
        var owner = document.getElementById("owner").value

    var owneraddress = document.getElementById("owneraddress").value
    var ownerdob = document.getElementById("ownerdob").value
    var ownerLnumber = document.getElementById("ownernumber").value
    var ownerexdate = document.getElementById("ownerexdate").value

    var ownerexists = await checkowner(owner);
    var careexists = await checkcar(number);
    var ownernum;


    if (ownerexists == true)
        {
            const { data, error} = await supabase
            .from('People')
            .select('PersonID, Name')
            .eq("Name",owner)
            data.forEach(function (item) {
            ownernum = item.PersonID;});
        }
    else if (ownerexists == false)
    {

        ownernum = i;
        const { error } = await supabase
        .from('People')
        .insert({PersonID:ownernum, Name: owner, Address: owneraddress, DOB:ownerdob, LicenseNumber:ownerLnumber, ExpiryDate:ownerexdate})
    }
    

    if (careexists == true)
        {

            const { error } = await supabase
            .from('Vehicles')
            .update({ Make: make, Model: model, Colour:colour, OwnerID:ownernum})
            .eq('VehicleID', number)
        }
    else if (careexists == false)
    {
        const { error } = await supabase
        .from('Vehicles')
        .insert({VehicleID:number, Make: make, Model: model, Colour:colour, OwnerID:ownernum})
    }



}


function DisplayAddPerson(hide)
{
    document.getElementById("owner").hidden = hide;

    document.getElementById("owneraddress").hidden = hide;
    document.getElementById("owneraddresslabel").hidden = hide;

    document.getElementById("ownerdob").hidden = hide;
    document.getElementById("ownerdoblabel").hidden = hide;

    document.getElementById("ownernumber").hidden = hide;
    document.getElementById("ownernumberlabel").hidden = hide;

    document.getElementById("ownerexdate").hidden = hide;
    document.getElementById("ownerexdatelabel").hidden = hide;

}





async function checkowner(owner)
{
    const { data, error} = await supabase
    .from('People')
    .select('Name')
    .eq("Name",owner)
    if (data.length > 0)
        return true;
    else
        return false;
}

async function checkcar(number)
{
    const { data, error} = await supabase
    .from('Vehicles')
    .select('*')
    .eq("VehicleID",number)
    if (data.length > 0)
        return true;
    else
        return false;
}
