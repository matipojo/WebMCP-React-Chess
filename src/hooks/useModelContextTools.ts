import { useEffect } from 'react';
import { Board } from '../models/Board';
import { Piece } from '../models/Piece';
import { Position } from '../models/Position';
import { PieceType } from '../Types';
import { chessNotationToCoordinates, parseMoveNotation } from '../utils/chess-notation-utils';
import '../model-context-types';

type ToolResponse = {
  success: boolean;
  message: string;
  data: unknown;
};

type ChessActions = {
  board: Board;
  playMove: (piece: Piece, destination: Position) => boolean;
  restartGame: () => void;
  promotePawn: (pieceType: PieceType) => void;
};

export function useModelContextTools({ board, playMove, restartGame, promotePawn }: ChessActions) {
  useEffect(() => {
    if (!navigator.modelContext) {
      return;
    }

    const tools = [
      {
        name: 'get-board-state',
        description: 'Retrieves the current state of the chess board including piece positions, current turn, total moves, and game status.',
        inputSchema: { type: 'object', properties: {} },
        execute: async (): Promise<ToolResponse> => ({
          success: true,
          message: 'Board state retrieved successfully',
          data: {
            pieces: board.pieces.map(piece => ({
              type: piece.type,
              team: piece.team,
              position: { x: piece.position.x, y: piece.position.y },
              hasMoved: piece.hasMoved,
              possibleMoves: piece.possibleMoves?.map(m => ({ x: m.x, y: m.y })) || [],
            })),
            totalTurns: board.totalTurns,
            currentTeamTurn: board.currentTeam,
            winningTeam: board.winningTeam,
          },
        }),
      },
      {
        name: 'make-move',
        description: 'Makes a chess move. Provide the move as "from:to" (e.g., "e2:e4").',
        inputSchema: {
          type: 'object',
          properties: {
            move: {
              type: 'string',
              description: 'Move in format "from:to" (e.g., "e2:e4")',
              default: 'e2:e4',
            },
          },
          required: ['move'],
        },
        execute: async (params: Record<string, unknown>): Promise<ToolResponse> => {
          try {
            const { from: fromNotation, to: toNotation } = parseMoveNotation(params.move as string);
            const fromCoords = chessNotationToCoordinates(fromNotation);
            const toCoords = chessNotationToCoordinates(toNotation);

            const from = new Position(fromCoords.x, fromCoords.y);
            const to = new Position(toCoords.x, toCoords.y);

            const piece = board.pieces.find(p => p.samePosition(from));
            if (!piece) {
              return { success: false, message: `No piece at ${fromNotation}`, data: null };
            }

            const success = playMove(piece, to);
            return {
              success,
              message: success ? `Moved ${piece.type} from ${fromNotation} to ${toNotation}` : `Invalid move ${fromNotation} to ${toNotation}`,
              data: { from: fromNotation, to: toNotation, piece: piece.type, team: piece.team },
            };
          } catch (error) {
            return { success: false, message: `Move failed: ${error}`, data: null };
          }
        },
      },
      {
        name: 'get-possible-moves',
        description: 'Gets all legal moves for a piece at a position (x: 0-7, y: 0-7).',
        inputSchema: {
          type: 'object',
          properties: {
            position: {
              type: 'object',
              properties: {
                x: { type: 'number', minimum: 0, maximum: 7, description: 'X coordinate (0=a, 7=h)' },
                y: { type: 'number', minimum: 0, maximum: 7, description: 'Y coordinate (0=rank 1, 7=rank 8)' },
              },
              required: ['x', 'y'],
            },
          },
          required: ['position'],
        },
        execute: async (params: Record<string, unknown>): Promise<ToolResponse> => {
          const pos = params.position as { x: number; y: number };
          const position = new Position(pos.x, pos.y);
          const piece = board.pieces.find(p => p.samePosition(position));

          if (!piece) {
            return { success: false, message: `No piece at (${pos.x}, ${pos.y})`, data: { possibleMoves: [] } };
          }

          const possibleMoves = piece.possibleMoves?.map(m => ({ x: m.x, y: m.y })) || [];
          return {
            success: true,
            message: `${possibleMoves.length} moves for ${piece.type} at (${pos.x}, ${pos.y})`,
            data: { piece: { type: piece.type, team: piece.team }, possibleMoves },
          };
        },
      },
      {
        name: 'restart-game',
        description: 'Restarts the chess game to initial position.',
        inputSchema: { type: 'object', properties: {} },
        execute: async (): Promise<ToolResponse> => {
          restartGame();
          return { success: true, message: 'Game restarted', data: null };
        },
      },
      {
        name: 'promote-pawn',
        description: 'Promotes a pawn to queen, rook, bishop, or knight.',
        inputSchema: {
          type: 'object',
          properties: {
            pieceType: {
              type: 'string',
              enum: ['queen', 'rook', 'bishop', 'knight'],
              description: 'Piece type to promote to.',
            },
          },
          required: ['pieceType'],
        },
        execute: async (params: Record<string, unknown>): Promise<ToolResponse> => {
          promotePawn(params.pieceType as PieceType);
          return { success: true, message: `Pawn promoted to ${params.pieceType}`, data: null };
        },
      },
    ];

    navigator.modelContext.provideContext({ tools });
  }, [board, playMove, restartGame, promotePawn]);
}
