export default {
    merged: {
        s1: {
            title:
                'Scenarie 1 – Kun studerende kopieres og begge fag bruges:',
            text: [
                'De studerende kopieres fra FRA-faget til TIL-faget, undervisere kopieres ikke',
                'Begge fag beholdes i itslearning',
                'Der kopieres og flyttes ingen STADS-grupper'
            ]
        },
        s2: {
            title:
                'Scenarie 2  - Grupper flyttes og kun Til-fag bruges:',
            text: [
                'De studerende kopieres fra FRA-faget til TIL-faget, undervisere kopieres ikke',
                'FRA-faget fx. TXXXXXXX-1-F21 laves om til en gruppe på TIL-faget (alle studerende der er tilmeldt TXXXXXXX i STADS, vil være i denne gruppe)',
                'STADS-grupper på FRA-faget flyttes til TIL-faget',
                'FRA-faget, SKAL slettes fra itslearning, inden samlæsning',
                'Er faget allerede oprettet skal du selv arkiver det og slette det + bede en sysadmin slette faget fra skraldespanden (sletningen kan IKKE fortrydes)',
            ]
        },
        s3: {
            title:
                'Scenarie 3 – Grupper kopiers og begge fag bruges:',
            text: [
                'De studerende kopieres fra FRA-faget til TIL-faget, undervisere kopieres ikke',
                'FRA-faget ændres ikke',
                'Der laves en kopi af de STADS-grupper der ligger på FRA-fag, kopien kommer til at ligge på TIL-faget'
            ]
        },
        s4: {
            title:
                'Scenarie 4 - Grupper flyttes og begge fag bruges:',
            text: [
                'De studerende kopieres fra FRA-faget til TIL-faget, undervisere kopieres ikke',
                'Begge fag beholdes i itslearning',
                'STADS-grupper på FRA-faget flyttes til TIL-faget',
            ]
        }
    }
};