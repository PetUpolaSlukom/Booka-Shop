window.onload = () =>{

    ispisHeaderFooter();

    
	$("#pretraga").keyup(promenaFiltera);
	$("#sort").change(promenaFiltera);
	$(".stanje").change(promenaFiltera);


    let url = window.location.pathname;
    if(url == '/' || url == '/index.html') {
        dohvatiPodatke("autori", ispisAutoraUFokusu);
	}
	if(url.indexOf('knjige') != -1) {

	    dohvatiPodatke("zanrovi", prikaziZanrove);
    }
    if(url.indexOf('kontakt') != -1) {

    }
    if(url.indexOf('autor') != -1) {

	}



    $(".navbar-toggler").click(function(){
        $("#responsive-meni")
            .css({
                "left" : "0",
                "top" : `${$(".navbar").height()}px`
            })
            .toggle();
    });

    var knjige = [];
    var zanrovi = [];
	var autori = [];

    function dohvatiPodatke(file, callback){
        $.ajax({
			url: "assets/data/" + file + ".json",
			method: "get",
			dataType: "json",
			success: function(response){
				callback(response);
			},
			error: function(err){
				console.log(err);
			}
		});
    }




    function ispisHeaderFooter(){
        let meniNiz = [
            ["index.html", "Početna"],
            ["knjige.html", "Knjige"],
            ["kontakt.html", "Kontakt"],
            ["autor.html", "Autor"]
        ]
        let meniR = document.querySelector("#responsive-meni-ul");
        let meniN = document.querySelector("#nav-meni-ul");
        let meniF = document.querySelector("#footer-meni-ul");
        
        html = ''

        for (let i = 0; i < meniNiz.length; i++) {
            html+= ` <li class="nav-item"><a href="${meniNiz[i][0]}" class="nav-link text-secondary">${meniNiz[i][1]}</a></li>`;
        }
        meniR.innerHTML = html;
        meniN.innerHTML = html;
        meniF.innerHTML = html;

        let linkoviNiz = [
            ["dokumentacija.pdf", "Dokumentacija"],
            ["assets/js/main.js", "JavaScript"],
            ["sitemap.xml", "Sitemap"]
        ]
        let links = document.querySelector("#links");
        for (let i = 0; i < linkoviNiz.length; i++) {
            links.innerHTML += ` <li class="nav-item"><a href="${linkoviNiz[i][0]}" class="nav-link text-secondary">${linkoviNiz[i][1]}</a></li>`;
        }

    }

    //POCETNA 
    //#region POCETNA 
    function ispisAutoraUFokusu(podaci) {
        let html = '';
        for (let autor of podaci) {
            if (autor.uFokusu) {
                html+= `
                
                    <div class="text-center col-9 col-sm-6 col-md-4 col-xl-2 brd-none mb-5 autor">
                        <img class="card-img-top rounded-circle mx-auto col-8 mb-3 p-4" src="assets/img/${autor.slika}" alt="${autor.ime}">
                        <div class="pb-4">
                            <p class="text-secondary">${autor.ime}</p>
                        </div>
                    </div>
                `;
            }
            // u else if ispis svih autora
        }
        $("#autoriUFokusu").html(html);

        autori = podaci;
        
        dohvatiPodatke("knjige", ispisUFokusu);
    }

    function ispisUFokusu(podaci) {
        let html = '';
        let i = 0;
        let uFokusu = false;
        for (let knjiga of podaci) {
            if (knjiga.uFokusu) {
                html+= `
                <div class="col-md-${i == 2? 3 : 2} col-sm-5 col-7 container">
                    <img class="img-fluid mb-3" src="assets/img/${knjiga.slika.src}" alt="${knjiga.slika.alt}">
                    <h4>${knjiga.naslov.toUpperCase()}</h3>
                    ${prikazAutor(knjiga.autorId)}
                    ${prikazCena(knjiga.cena)}
                </div>`;
                i++;
                uFokusu = true;
            }
            // u else if ispis svih knjiga
        }
        if (uFokusu) {
            html += `<div class="col-12 d-flex justify-content-around mt-5">
                        <a href="index.html" id="viseKnjiga">Prikaži sve</a>
                    </div>`
        }
        $("#uFokusu").html(html);
        knjige = podaci;
    }

    function prikazCena(cena) {
        let original = parseInt(cena.original);
        let popust = parseInt(cena.popust)/100;

        if (popust != 0) {
            return `<s>${original},00 RSD</s>
                    <p class="cena">${parseInt(original - original * popust)},00 RSD</p>`
        }
        else{
            return `<p class="cena">${original},00 RSD</p>`
        }
    }
    
    function prikazAutor(autorId) {
		let imeAutora = autori.filter(b => b.id == autorId)[0].ime;
		return `<p class="bg-my d-inline">${imeAutora}</p></br>`;
    }
    //#endregion



    // KNJIGE

    function prikaziZanrove(data){
		let html = "";
		data.forEach(zanr => {
			html += `<li class="list-group-item">
					   <input type="checkbox" value="${zanr.id}" class="zanr" name="zanrovi"/> ${zanr.naziv}
					</li>`;
		});
		document.getElementById('zanrovi').innerHTML = html;
		zanrovi = data;
		$('.zanr').change(promenaFiltera);
		
		dohvatiPodatke("autori", prikaziPisce);
	}
	
	function prikaziPisce(podaci){
		let html = "";
		podaci.forEach(autor => {
			html += `<li class="list-group-item">
					   <input type="checkbox" value="${autor.id}" class="pisac" name="pisci"/> ${autor.ime}
					</li>`;
		});
		document.getElementById('pisci').innerHTML = html;
		autori = podaci;
		$('.pisac').change(promenaFiltera);
		
		dohvatiPodatke("knjige", prikaziKnjige);
	}
    function prikaziKnjige(podaci){
		podaci = pisacFilter(podaci);
		podaci = zanroviFilter(podaci);
		podaci = dostupnostFilter(podaci);
		podaci = pretraziKnjige(podaci);
		podaci = sort(podaci);
		let html = "";
		for(let knjiga of podaci){
			html+= `
			<div class="col-lg-4 col-md-6 mb-4 prikazURedu">
            <div class=" h-100">
              <img class="card-img-top" src="assets/img/${knjiga.slika.src}" alt="${knjiga.slika.alt}">
              <div class="card-body">
                <h4>${knjiga.naslov.toUpperCase()}</h3>
				${prikazAutor(knjiga.autorId)}
                ${prikazCena(knjiga.cena)}
				<p  class="font-weight-bold" id="categories">
					${prikazZanrovi(knjiga.zanrovi)}
				</p>
              </div>
            </div>
          </div>`;
		}
		if(!podaci.length){
			html += `<h2 class='text-center col-12'>Uuups!</h2>
                <h2 class='text-center col-12'>Nema dostupnih knjiga za odabrani filter.</h2>
                <div class='d-flex justify-content-around col-12'>
                    <img src="assets/img/nemaProizvoda.jpg" alt="Nema proizvoda" class="img-fluid">
                </div>`;
		}
		$("#knjige").html(html);
	}
    function prikazZanrovi(ids){
		let html = "";
		let zanroviKnjige = zanrovi.filter(c => ids.includes(c.id));
		for(let i in zanroviKnjige){
			html += zanroviKnjige[i].naziv;
			if(i != zanroviKnjige.length - 1){
				html += ", ";
			}
		}
		return html;
	}
    function pisacFilter(podaci){
		let selectedPisci = [];
		$('.pisac:checked').each(function(el){
			selectedPisci.push(parseInt($(this).val()));
		});
		if(selectedPisci.length != 0){
			return podaci.filter(x => selectedPisci.includes(x.autorId));	
		}
		return podaci;
	}
    function zanroviFilter(podaci){
		let selectedZanrovi = [];
		$('.zanr:checked').each(function(el){
			selectedZanrovi.push(parseInt($(this).val()));
		});
		if(selectedZanrovi.length != 0){
			return podaci.filter(x => x.zanrovi.some(y => selectedZanrovi.includes(y)));	
		}
		return podaci;
	}
    function pretraziKnjige(podaci){
		let pretragaValue = $("#pretraga").val().toLowerCase();
		if(pretragaValue){
			return podaci.filter(function(el){
				return el.naslov.toLowerCase().indexOf(pretragaValue) !== -1;
			})
		}
		return podaci;
	}
    function sort(podaci){
		const sortType = document.getElementById('sort').value;
		if(sortType == 'asc'){
			return podaci.sort((a,b) => ukupnaCena(a.cena.original, a.cena.popust) > ukupnaCena(b.cena.original, b.cena.popust) ? 1 : -1);
		}
		return podaci.sort((a,b) => ukupnaCena(a.cena.original, a.cena.popust) < ukupnaCena(b.cena.original, b.cena.popust) ? 1 : -1);
	}
    function ukupnaCena(cena, popust) {
        if (popust) {
            return cena - cena*(popust/100);
        }
        else
            return cena
    }
    function dostupnostFilter(podaci){
		var dostupnost = $("input[name='stanje']:checked").val();
		if(dostupnost == "dostupno"){
            console.log(123);
			return podaci.filter(x => x.naStanju);
		}if(dostupnost == "nedostupno"){
			return podaci.filter(x => !x.naStanju);
		}
		return podaci;
	}
    document.querySelector('#prikaz3').addEventListener('click', function() {
        var divovi = document.querySelectorAll('.prikazURedu');
            for (let i = 0; i < divovi.length; i++) {
                console.log(123);
                divovi[i].classList.remove("col-lg-3");
                divovi[i].classList.add("col-lg-4");
            }
        document.querySelector('#prikaz3').classList.remove('btn-deact');
        document.querySelector('#prikaz3').classList.add('btn-act');
        document.querySelector('#prikaz4').classList.remove('btn-act');
        document.querySelector('#prikaz4').classList.add('btn-deact');
    })
    document.querySelector('#prikaz4').addEventListener('click', function() {
        var divovi = document.querySelectorAll('.prikazURedu');
            for (let i = 0; i < divovi.length; i++) {
                console.log(123);
                divovi[i].classList.remove("col-lg-4");
                divovi[i].classList.add("col-lg-3");
            }
        document.querySelector('#prikaz4').classList.remove('btn-deact');
        document.querySelector('#prikaz4').classList.add('btn-act');
        document.querySelector('#prikaz3').classList.remove('btn-act');
        document.querySelector('#prikaz3').classList.add('btn-deact');
    })

    function promenaFiltera(){
		dohvatiPodatke("knjige", prikaziKnjige);
	}
    
}