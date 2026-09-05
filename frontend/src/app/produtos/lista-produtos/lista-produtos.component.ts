import { CommonModule } from "@angular/common";
import { Component, inject, ChangeDetectorRef, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { finalize } from "rxjs/operators";

import { CabecalhoComponent } from "../../compartilhado/cabecalho/cabecalho.component";
import { CarregamentoComponent } from "../../compartilhado/carregamento/carregamento.component";
import { MensagemComponent } from "../../compartilhado/mensagem/mensagem.component";
import { Produto } from "../produto.model";
import { ProdutoService } from "../produto.service";

@Component({
  selector: "app-lista-produtos",
  standalone: true,
  imports: [
    CommonModule,
    CabecalhoComponent,
    CarregamentoComponent,
    MensagemComponent,
    RouterLink,
  ],
  templateUrl: "./lista-produtos.component.html",
  styleUrl: "./lista-produtos.component.css",
})
export class ListaProdutosComponent implements OnInit {
  private readonly produtoService = inject(ProdutoService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected produtos: Produto[] = [];
  protected carregando = false;
  protected mensagemErro = "";
  protected mensagemSucesso = "";

  ngOnInit(): void {
    this.carregarProdutos();
  }

  private carregarProdutos(): void {
    this.carregando = true;
    this.mensagemErro = "";

    this.produtoService
      .listar()
      .pipe(
        finalize(() => {
          this.carregando = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (produtos) => {
          this.produtos = produtos;
        },
        error: () => {
          this.mensagemErro =
            "Não foi possível carregar os produtos. Verifique se o Back-End está rodando.";
        },
      });
  }

  protected excluir(id: number): void {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    this.carregando = true;
    this.mensagemErro = "";
    this.mensagemSucesso = "";

    this.produtoService
      .excluir(id)
      .pipe(finalize(() => {
        this.carregando = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => {
          this.mensagemSucesso = "Produto excluído com sucesso!";
          this.carregarProdutos();
        },
        error: () => {
          this.mensagemErro = "Erro ao excluir o produto.";
        },
      });
  }
}
