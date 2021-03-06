window.onload = () =>{

    dohvatiPodatke("meni", ispisHeaderFooter);
    brojStavkiUKorpi();

    
	$("#pretraga").keyup(promenaFiltera);
	$("#sort").change(promenaFiltera);
	$(".stanje").change(promenaFiltera);
    $(document).on("click",".obrisiIzKorpe",function(){
        obrisiIzKorpe($(this).data('id'));
    });
    $(document).on("change",".kolicina",function(){
        promenaKolicine($(this).data('id'), $(this).val());
    });


    
    let url = window.location.pathname;
	if(url.indexOf('knjige') != -1) {
        promeniBrojURedu();
	    dohvatiPodatke("zanrovi", prikaziZanrove);
    }
    else if(url.indexOf('kontakt') != -1) {

    }
    else if(url.indexOf('autor') != -1) {

	}
    else if(url.indexOf('korpa') != -1) {
        korpaIspis();
	}
    else{
        dohvatiPodatke("autori", ispisAutoraUFokusu);
    }

    


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

    $(document).on("click",".navbar-toggler",function(){
        $("#responsive-meni")
            .css({
                "left" : "0",
                "top" : `${$(".navbar").height()}px`
            })
            .toggle();
    });



    function ispisHeaderFooter(podaci){
        
    

        var meniNiz = podaci;
        
        htmlNav = `<div id="responsive-meni" class="w-100 position-absolute d-md-none">
                    <ul id="responsive-meni-ul" class="navbarMenu-ul bg-light w-100 text-center">
                        ${meniIspis()}
                    </ul>
                </div>
                <button class="navbar-toggler">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <a href="index.html" class="navbar-brand col-5"><img src="assets/img/logo.png" class="img-fluid" alt="Booka logo"/></a>
                <div class="collapse navbar-collapse nav-pills col-md-4" id="navbarMenu">
                    <ul id="nav-meni-ul" class="navbarMenu-ul navbar-nav container justify-content-around">
                        ${meniIspis()}
                    </ul> 
                </div>
                <a id="korpaLink"  href="korpa.html">
                    <button type="button" id="korpa" class="btn btn-lg">
                        <span class="fa fa-shopping-cart" aria-hidden="true"></span>
                        <span class="cart-count">0</span>
                    </button>
                </a>`;

        function meniIspis() {
            
            ispis = '';
            for (let i = 0; i < meniNiz.length; i++) {
                ispis+= ` <li class="nav-item"><a href="${meniNiz[i].url}" class="nav-link text-secondary">${meniNiz[i].naziv}</a></li>`;
            }
            return ispis;
        }

        let navbar = document.querySelector(".navbar");
        navbar.innerHTML = htmlNav;


        let htmlFoot = `<div class="col-9 d-flex flex-wrap justify-content-around">
                            <div class="col-sm-3 pt-5">
                                <h3 calss="text-white">MENI</h3>
                                <ul id="footer-meni-ul" class="navbarMenu-ul navbar-nav container d-inline">
                                    ${meniIspis()}
                                </ul> 
                            </div>
                            <div class="col-sm-3 pt-5">
                                <h3 calss="text-white">LINKOVI</h3>
                                <ul id="links" class="navbarMenu-ul navbar-nav container">
                                    ${linkIspis()}
                                </ul> 
                            </div>    
                            <div class="col-sm-3 col-10 pt-5 text-center">
                                <h3 calss="text-white">BOOKA STORE</h3>
                                <a href="index.html"><img class="img-fluid pt-4 pb-4" src="assets/img/logoKrug.png" alt="Booka logo"></a>  
                                <p class="cena">??or??e Mini?? 135 / 19</p>
                            </div>
                        </div>`
                            
        function linkIspis() {
            let linkoviNiz = [
                ["dokumentacija.pdf", "Dokumentacija"],
                ["assets/js/main.js", "JavaScript"],
                ["sitemap.xml", "Sitemap"]
            ]
            ispis = '';
            for (let i = 0; i < linkoviNiz.length; i++) {
                ispis += ` <li class="nav-item"><a href="${linkoviNiz[i][0]}" target="_blanc"class="nav-link text-secondary">${linkoviNiz[i][1]}</a></li>`;
            }
            return ispis;
        }
        let footeri = document.querySelector(".footer");
        footeri.innerHTML = htmlFoot;

    }

    //POCETNA 
    //#region POCETNA 
    function ispisAutoraUFokusu(podaci) {
        let html = '';
        for (let autor of podaci) {
            if (autor.uFokusu) {
                html+= `
                
                    <div class="text-center col-9 col-sm-6 col-md-4 col-xl-2  mb-5 autor">
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
                        <a href="knjige.html" class="linkBtn">Prika??i sve</a>
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
			html += `<li class="list-group-item border border-0">
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
			html += `<li class="list-group-item border border-0">
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
			<div class="col-lg-3 col-sm-6 col-10 mb-4 prikazURedu">
                <div class=" h-100">
                    <img class="card-img-top" src="assets/img/${knjiga.slika.src}" alt="${knjiga.slika.alt}">
                    <div class="card-body">
                        <h4>${knjiga.naslov.toUpperCase()}</h3>
                        ${prikazAutor(knjiga.autorId)}
                        ${prikazCena(knjiga.cena)}
                        <p  class="font-weight-bold" id="categories">
                            ${prikazZanrovi(knjiga.zanrovi)}
                        </p>
                        ${dodajUKorpu(knjiga.naStanju, knjiga.id)}
                        <h6 id="dodatoSpan${knjiga.id}" class="my-2 cena"></h6>
                    </div>
                </div>
            </div>`;
		}
        knjige = podaci;
		if(!podaci.length){
			html += `<h2 class='text-center col-12'>Uuups!</h2>
                <h2 class='text-center col-12'>Nema dostupnih knjiga za odabrani filter.</h2>
                <div class='d-flex justify-content-around col-12'>
                    <img src="assets/img/nemaDostupnihProizvoda.png" alt="Nema proizvoda" class="col-4">
                </div>`;
		}
		$("#knjige").html(html);
        $(".dodajUKorpuBtn").click(dodavanjeKnjigeUKorpu);
	}
    // LOCAL STORAGE
    function dodavanjeKnjigeUKorpu() {
        let id = $(this).data('id');

        var knjigeUKorpi = uzmiIzLS('knjigeKorpa');
        if (knjigeUKorpi) {
            if (postojiUKorpi()) {
                dodajKolicinu();
            }
            else{
                dodajUKorpu();
            }
        }
        else{
            dodajPrvuUKorpu();
        }

        function postojiUKorpi() {
            for (obj of knjigeUKorpi) {
                if (obj.id == id) {
                    return true;
                }
            }
            return false;
        }
        function dodajKolicinu() {
            let izKorpe = uzmiIzLS('knjigeKorpa');
            for (let i=0; i<izKorpe.length; i++) {
                if (izKorpe[i].id == id) {
                    izKorpe[i].kolicina++;
                }
            }
            dodajULS("knjigeKorpa", izKorpe);
        }
        function dodajUKorpu() {
            let izKorpe = uzmiIzLS('knjigeKorpa');
            let novaKnjiga = {
                id: id,
                kolicina: 1
            }
            izKorpe.push(novaKnjiga);
            dodajULS("knjigeKorpa", izKorpe);
        }
        function dodajPrvuUKorpu() {
            let knjige = [];
            knjige[0] = {
                id : id,
                kolicina : 1
            };

            dodajULS("knjigeKorpa", knjige);
        }
        
        brojStavkiUKorpi();
        obavestenjeDodato(id);
        

    }
    function uzmiIzLS(name) {
        return JSON.parse(localStorage.getItem(name));
    }
    function dodajULS(name, podaci) { //33.41
        localStorage.setItem(name, JSON.stringify(podaci))
    }
    function brojStavkiUKorpi() {
        let izKorpe = uzmiIzLS('knjigeKorpa');
        let count = 0;
        for (i in izKorpe) {
            count += izKorpe[i].kolicina;
        }
        $(".cart-count").html(count);
    }   
    function obavestenjeDodato(id) {
        let idSpana = "#dodatoSpan"+id;
        $(idSpana).html("Uspe??no dodato u korpu!");

        nestajanjeObavestenja(idSpana);
    }
    function nestajanjeObavestenja(id){
        setTimeout(function(){
            $(id).html("");

        }, 3000);
    }

    
    function korpaIspis() {
        let izKorpe = uzmiIzLS('knjigeKorpa');
        let html = '';
        if (izKorpe == null || izKorpe.length == 0) {
            html = `<div class='d-flex justify-content-around'>
                <img src="assets/img/praznaKorpa.png" alt="Nema proizvoda" class="col-lg-5 col-12 col-sm-8">
                </div>
                <h2 class='text-center col-12 p-50-0 text-secondary' >Va??a korpa je trenutno prazna. ??elite nazad na kupovinu?</h2>
                <div class="col-12 mb-5 d-flex justify-content-around">
                    <a href="knjige.html" class="linkBtn">Povratak na kupovinu</a>
                </div>`;
            $("#korpaMain").html(html);
            $("#korpaNarucivanje").html('');
        }
        else{
            dohvatiPodatke("knjige", obradaKorpe);
            function obradaKorpe(podaci) {
                ispisiKnjigeIzKorpe(podaci, izKorpe);
                ispisNarucivanje(podaci, izKorpe);
            }
            function ispisiKnjigeIzKorpe(podaci, podaciLS){
                let knjigeKorpa = podaciLS;
                let sveKnjige = podaci;
                for (objLS of knjigeKorpa) {
                    for (objKnjiga of sveKnjige) {
                        if (objLS.id == objKnjiga.id) {
                            html += `<tr>
                                    <th scope="row" class="align-middle text-dark"><button class="obrisiIzKorpe brd-none" data-id="${objKnjiga.id}" ><i  class="fas fa-trash-alt align-center"></i></button></th>
                                    <td class="align-middle text-dark w-25"><img class="w-25" src="assets/img/${objKnjiga.slika.src}" alt="${objKnjiga.slika.alt}"></td>
                                    <td class="align-middle text-dark">${objKnjiga.naslov}</td>
                                    <td class="align-middle text-dark">${prikazCenaKorpa(objKnjiga.cena)},00 RSD</td>
                                    <td class="align-middle text-dark"><input class="pl-2 kolicina" data-id="${objKnjiga.id}"" type="number" min="1" max="99" step="1" value="${objLS.kolicina}"></td>
                                    <td class="align-middle text-dark">${objLS.kolicina*prikazCenaKorpa(objKnjiga.cena)},00 RSD</td>
                                </tr>`;
                        }
                    }
                }
                $("#tbody").html(html);
            }
            
            function ispisNarucivanje(podaci, podaciLS) {
                let knjigeKorpa = podaciLS;
                let sveKnjige = podaci;
                let cenaKnjiga = 0;
                let cenaDostave = 99;

                for (objLS of knjigeKorpa) {
                    for (objKnjiga of sveKnjige) {
                        if (objLS.id == objKnjiga.id) {
                            cenaKnjiga += objLS.kolicina*prikazCenaKorpa(objKnjiga.cena)
                        }
                    }
                }
                
                $("#cenaNarucenihKnjiga").html(cenaKnjiga+',00 RSD');
                $("#cenaDostave").html('Fiksna cena dostave je: '+ cenaDostave +',00 RSD');
                $("#ukupanTrosak").html(cenaDostave + cenaKnjiga+',00 RSD');
            }
            
            function prikazCenaKorpa(cena) {
                let original = parseInt(cena.original);
                let popust = parseInt(cena.popust)/100;

                if (popust != 0) {
                    return parseInt(original - original * popust);
                }
                else{
                    return original;
                }
            }

            $("#buttonObrisiKorpu").on('click', function() {
                localStorage.removeItem('knjigeKorpa');
                korpaIspis();
                brojStavkiUKorpi();
                $("#korpaNarucivanje").html('');
            })
        }
    }


    function obrisiIzKorpe(id) {
        let izKorpe = uzmiIzLS('knjigeKorpa');

        let rezultat = izKorpe.filter(c => c.id != id);
        
        dodajULS("knjigeKorpa", rezultat);
        korpaIspis();
        brojStavkiUKorpi();
    }
    
    function promenaKolicine(id, val) {
        let newValue = parseInt(val);
        let izKorpe = uzmiIzLS('knjigeKorpa');
            for (let i=0; i<izKorpe.length; i++) {
                if (izKorpe[i].id == id) {
                    izKorpe[i].kolicina = newValue;
                }
            }
        dodajULS("knjigeKorpa", izKorpe);
        korpaIspis();
        brojStavkiUKorpi();
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
    function dodajUKorpu(stanje, id) {
        if (stanje) {
            return `<button type="button" class="dodajUKorpuBtn btn linkBtn btn-lg p-2" data-id="${id}">Dodaj u korpu</button>`
        }
        return `<button type="button" class="btn btn-outline-secondary btn-lg disabled p-2"  data-id="${id}" disabled>Nije na stanju</button>`
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
			return podaci.filter(x => x.naStanju);
		}
        if(dostupnost == "nedostupno"){
			return podaci.filter(x => !x.naStanju);
		}
		return podaci;
	}
    function promeniBrojURedu() {
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
                    divovi[i].classList.remove("col-lg-4");
                    divovi[i].classList.add("col-lg-3");
                }
            document.querySelector('#prikaz4').classList.remove('btn-deact');
            document.querySelector('#prikaz4').classList.add('btn-act');
            document.querySelector('#prikaz3').classList.remove('btn-act');
            document.querySelector('#prikaz3').classList.add('btn-deact');
        })
    }
    function promenaFiltera(){
		dohvatiPodatke("knjige", prikaziKnjige);
	}



    



    // VALIDACIJA FORME
    
    function resetovanjeForme(forma){
        $(".forma-greska").remove();
        $(".forma-uspeh").remove();

    }
    function greska(element, poruka){
        $(`<span class="forma-greska text-danger">${poruka}</span>`).insertAfter($(element));
    }
    function uspesno(forma, element, poruka) {
        $(`<span class="forma-uspeh">${poruka}</span>`).insertAfter($(element));
        forma.reset();

    }


    function inputPrazno(element, naziv){
        if(element.value.length == 0){
            greska(element,`Polje za ${naziv} ne sme biti prazno.`);
            return true;
        }
        return false;
    }
    let regImePrezime = /^[A-Z??????????][a-z??????????]{2,15}(\s[A-Z??????????][a-z??????????]{2,15}){0,2}$/;
    let regEmail = /^[a-z]((\.|-|_)?[a-z0-9]){2,}@[a-z]((\.|-|_)?[a-z0-9]+){2,}\.[a-z]{2,6}$/i;
    let regAdresa = /^[\w\.]+(,?\s[\w\.]+){2,8}$/;



    //KORPA STRANA
    $(document.korpa).on("submit", function(event){
        validirajPorudzbinu(event);
    });
    //KONTAKT STRANA
    $(document.kontakt).on("submit", function(event){
        validirajKontakt(event);
    });

    function validirajPorudzbinu(event) {
        event.preventDefault();
        resetovanjeForme(document.korpa);
                
        let indikatorGreske = false;

        //Ime i prezime
        if(inputPrazno(document.korpa.name, "ime i prezime")){
            indikatorGreske = true;
        }
        else {
            if(!regImePrezime.test(document.korpa.name.value)){
                greska(document.korpa.name,"Ime i prezime nisu dobro napisani.");
                indikatorGreske = true;
            }
        }
        //Email
        if(inputPrazno(document.korpa.mail, "email adresu")){
            indikatorGreske = true;
        }
        else {
            if(!regEmail.test(document.korpa.mail.value)){
                console.log(123);
                greska(document.korpa.mail,"Imejl adresa nije dobro napisana.");
                indikatorGreske = true;
            }
        }
        //Adresa
        if(inputPrazno(document.korpa.adresa, "adresu i grad")){
            indikatorGreske = true;
        }
        else {
            if(!regAdresa.test(document.korpa.adresa.value)){
                greska(document.korpa.adresa,"Adresa nije dobro napisana.");
                indikatorGreske = true;
            }
        }
        if(!indikatorGreske){
            localStorage.removeItem('knjigeKorpa');
            uspesnaPorudzbina();
            brojStavkiUKorpi();
            $("#korpaNarucivanje").html('');

        }

        function uspesnaPorudzbina() {
            let html = '';
                html = `<div class='d-flex justify-content-around'>
                    <img src="assets/img/uspesnaPorudzbina.jpg" alt="Uspesna Porudzbina" class="col-lg-5 col-12 col-sm-8">
                    </div>
                    <h2 class='text-center col-12 p-50-0 text-secondary' >Va??a porud??bina je uspe??no poslata! O??ekujte da Vas kontaktiramo. ??elite da nastavite kupovinu?</h2>
                    <div class="col-12 mb-5 d-flex justify-content-around">
                        <a href="knjige.html" class="linkBtn">Povratak na kupovinu</a>
                    </div>`;
                $("#korpaMain").html(html);
                $("#korpaNarucivanje").html('');
        }

    }

    

    function validirajKontakt(event){
        event.preventDefault();
        resetovanjeForme(document.kontakt);
                
        let indikatorGreske = false;

        //Ime i Prezime
        if(inputPrazno(document.kontakt.name, "ime i prezime")){
            indikatorGreske = true;
        }
        else {
            if(!regImePrezime.test(document.kontakt.name.value)){
                greska(document.kontakt.name,"Ime i prezime nisu dobro napisani.");
                indikatorGreske = true;
            }
        }
        
        //Email
        if(inputPrazno(document.kontakt.mail, "email adresu")){
            indikatorGreske = true;
        }
        else {
            if(!regEmail.test(document.kontakt.mail.value)){
                greska(document.kontakt.mail,"Imejl adresa nije dobro napisana.");
                indikatorGreske = true;
            }
        }
        
        //Poruka
        if(inputPrazno(document.kontakt.text, "poruku")){
            indikatorGreske = true;
        }
        else {
            if(document.kontakt.text.value.length < 20){
                greska(document.kontakt.text,"Poruka mora sadr??ati bar 20 karaktera.");
                indikatorGreske = true;
            }
        }
        if (!indikatorGreske) {
            uspesno(document.kontakt, document.kontakt.button, "Poruka je uspe??no poslata!")
        }

        
    }
    
}