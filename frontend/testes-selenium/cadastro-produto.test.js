// Importando recursos da biblioteca Selenium WebDriver
const { Builder, By, until } = require("selenium-webdriver");


async function testarCadastroProduto() {

    // Criar um nome único para o produto
    const nomeProduto = `Notebook Gamer ${Date.now()}`;

    // Criar o navegador que será controlado pelo Selenium
    const driver = await new Builder()
        .forBrowser("chrome")
        .build();

    try {

        // 1. Abrir a página de cadastro
        await driver.get("http://localhost:4200/produtos/novo");


        // 2. Preencher o nome
        await driver.findElement(By.id("nome"))
            .sendKeys(nomeProduto);


        // 3. Preencher a categoria
        await driver.findElement(By.id("categoria"))
            .sendKeys("Eletrônicos");


        // 4. Preencher a descrição
        await driver.findElement(By.id("descricao"))
            .sendKeys("Notebook para jogos e desenvolvimento.");


        // 5. Preencher o preço
        await driver.findElement(By.id("preco"))
            .sendKeys("3500");


        // 6. Preencher a imagem
        await driver.findElement(By.id("imagem"))
            .sendKeys("https://via.placeholder.com/600x400");


        // 7. Clicar no botão de cadastrar
        await driver.findElement(By.id("btnCadastrar"))
            .click();


        // 8. Esperar a navegação para a lista de produtos
        await driver.wait(
            until.urlIs("http://localhost:4200/produtos"),
            5000
        );

        console.log("Navegação para a lista de produtos realizada.");


        // 9. Procurar pelo produto que acabou de ser cadastrado
        const produto = await driver.wait(
            until.elementLocated(
                By.xpath(`//h2[contains(normalize-space(), '${nomeProduto}')]`)
            ),
            5000
        );


        // 10. Pegar o nome encontrado na tela
        const nomeEncontrado = await produto.getText();


        console.log("Nome cadastrado:", nomeProduto);
        console.log("Nome encontrado:", nomeEncontrado);


        // 11. Verificar se o produto correto foi encontrado
        if (nomeEncontrado.trim() === nomeProduto) {

            console.log("✅ TESTE PASSOU!");
            console.log("O produto foi cadastrado e encontrado na lista.");

        } else {

            console.log("❌ TESTE FALHOU!");
            console.log("O produto encontrado não corresponde ao produto cadastrado.");

        }


    } finally {

        // 12. Fechar o navegador
        await driver.quit();

    }
}


// Executar o teste
testarCadastroProduto();