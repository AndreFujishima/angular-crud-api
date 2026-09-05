import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { finalize } from "rxjs/operators";

import { CabecalhoComponent } from "../../compartilhado/cabecalho/cabecalho.component";
import { CarregamentoComponent } from "../../compartilhado/carregamento/carregamento.component";
import { MensagemComponent } from "../../compartilhado/mensagem/mensagem.component";
import { Produto } from "../produto.model";
import { ProdutoService } from "../produto.service";

@Component({
  selector: "app-produto-formulario",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CabecalhoComponent,
    CarregamentoComponent,
    MensagemComponent,
    RouterLink,
  ],
  templateUrl: "./produto-formulario.component.html",
})
export class ProdutoFormularioComponent implements OnInit {
  private readonly produtoService = inject(ProdutoService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  protected carregando = false;
  protected mensagemErro = "";
  protected mensagemSucesso = "";

  protected produtoForm: FormGroup;
  protected editandoId: number | null = null;

  constructor() {
    this.produtoForm = this.fb.group({
      nome: ["", Validators.required],
      descricao: ["", Validators.required],
      categoria: ["", Validators.required],
      preco: [null, [Validators.required, Validators.min(0.01)]],
      imagem: [""],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.editandoId = parseInt(id, 10);
      this.carregarProduto();
    }
  }

  private carregarProduto(): void {
    if (!this.editandoId) return;

    this.carregando = true;
    this.mensagemErro = "";

    this.produtoService
      .buscarPorId(this.editandoId)
      .pipe(
        finalize(() => {
          this.carregando = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (produto) => {
          this.produtoForm.patchValue({
            nome: produto.nome,
            descricao: produto.descricao,
            categoria: produto.categoria,
            preco: produto.preco,
            imagem: produto.imagem,
          });
        },
        error: () => {
          this.mensagemErro =
            "Não foi possível carregar os dados do produto para edição.";
        },
      });
  }

  protected salvar(): void {
    if (this.produtoForm.invalid) return;

    this.carregando = true;
    this.mensagemErro = "";
    this.mensagemSucesso = "";

    const produtoData: Produto = this.produtoForm.value;

    if (this.editandoId) {
      this.produtoService
        .atualizar(this.editandoId, produtoData)
        .pipe(
          finalize(() => {
            this.carregando = false;
            this.cdr.detectChanges();
          }),
        )
        .subscribe({
          next: () => {
            this.mensagemSucesso = "Produto atualizado com sucesso!";
            setTimeout(() => this.router.navigate(["/produtos"]), 1500);
          },
          error: () => {
            this.mensagemErro = "Erro ao atualizar o produto.";
          },
        });
    } else {
      this.produtoService
        .cadastrar(produtoData)
        .pipe(
          finalize(() => {
            this.carregando = false;
            this.cdr.detectChanges();
          }),
        )
        .subscribe({
          next: () => {
            this.mensagemSucesso = "Produto cadastrado com sucesso!";
            setTimeout(() => this.router.navigate(["/produtos"]), 1500);
          },
          error: () => {
            this.mensagemErro = "Erro ao cadastrar o produto.";
          },
        });
    }
  }
}
